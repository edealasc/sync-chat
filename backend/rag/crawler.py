import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, urlunparse
from collections import deque
import csv
import time
import logging
from tokenizer import tokenizer  # Centralized tokenizer from embeddings.py
from functools import lru_cache
import nltk
from nltk.tokenize import sent_tokenize

# -------------------------------
# Setup logging
# -------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# -------------------------------
# Download NLTK punkt tokenizer
# -------------------------------
nltk.download('punkt')

# -------------------------------
# Token counting with caching
# -------------------------------
@lru_cache(maxsize=100000)
def count_tokens(text):
    return len(tokenizer.encode(text, add_special_tokens=False))

# -------------------------------
# Normalize URLs
# -------------------------------
def normalize_url(url):
    parsed = urlparse(url)
    # Remove fragment and query
    normalized = parsed._replace(fragment="", query="")
    return urlunparse(normalized)

# -------------------------------
# Extract sections from HTML
# -------------------------------
def extract_sections(soup, min_tokens=50):
    # Remove unwanted elements
    for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
        tag.decompose()

    body = soup.body
    if not body:
        return []

    sections = []
    block_tags = ['p', 'li', 'section']  # avoid generic 'div'

    # Iterate through top-level tags only to avoid nested duplicates
    for element in body.find_all(block_tags + ['h1','h2','h3','h4','h5','h6'], recursive=True):
        if element.name in ['h1','h2','h3','h4','h5','h6']:
            # Start a new section
            current_header = element.get_text(strip=True)
            h_level = int(element.name[1])
            current_text = []

            # Collect sibling block tags until next header
            for sibling in element.find_next_siblings():
                if sibling.name in ['h1','h2','h3','h4','h5','h6']:
                    break
                if sibling.name in block_tags:
                    text = sibling.get_text(" ", strip=True)
                    if text:
                        current_text.append(' '.join(text.split()))

            section_text = ' '.join(current_text).strip()
            if count_tokens(section_text) >= min_tokens:
                sections.append({
                    'section_title': current_header or "Untitled",
                    'h_level': h_level,
                    'text': section_text
                })

    return sections

# -------------------------------
# Crawl function with retries and streaming CSV
# -------------------------------
def crawl(start_url, output_file="crawl_results.csv", max_pages=50, min_tokens=50, delay=1, max_depth=None, max_retries=3):
    visited = set()
    queue = deque([(start_url, 0)])  # tuple of (url, depth)
    pages_scraped = 0

    # Open CSV for streaming write
    with open(output_file, "w", encoding="utf-8", newline="") as csvfile:
        fieldnames = ['url', 'section_title', 'h_level', 'text']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()

        while queue and (max_pages is None or pages_scraped < max_pages):
            url, depth = queue.popleft()
            norm_url = normalize_url(url)
            if norm_url in visited:
                continue
            if max_depth is not None and depth > max_depth:
                continue

            for attempt in range(max_retries):
                try:
                    headers = {'User-Agent': 'Mozilla/5.0 (compatible; CrawlerBot/1.0)'}
                    response = requests.get(url, timeout=5, headers=headers)
                    if response.status_code != 200:
                        raise Exception(f"Status code {response.status_code}")
                    break
                except Exception as e:
                    logging.warning(f"Attempt {attempt+1} failed for {url}: {e}")
                    time.sleep(2)
            else:
                logging.error(f"Failed to fetch {url} after {max_retries} attempts")
                continue

            visited.add(norm_url)
            soup = BeautifulSoup(response.text, 'html.parser')
            sections = extract_sections(soup, min_tokens=min_tokens)

            for sec in sections:
                writer.writerow({
                    'url': url,
                    'section_title': sec['section_title'],
                    'h_level': sec['h_level'],
                    'text': sec['text']
                })

            pages_scraped += 1
            if pages_scraped % 5 == 0:
                logging.info(f"Scraped {pages_scraped} pages...")

            # Queue internal links
            for link in soup.find_all('a', href=True):
                next_url = urljoin(url, link['href'])
                norm_next = normalize_url(next_url)
                if urlparse(norm_next).netloc == urlparse(start_url).netloc and norm_next not in visited:
                    queue.append((norm_next, depth + 1))

            # Polite crawling
            time.sleep(delay)

    logging.info(f"Crawling complete. {pages_scraped} pages scraped. CSV saved to {output_file}.")
