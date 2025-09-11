import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, urlunparse
from collections import deque
import csv
import time
import logging
from functools import lru_cache
from .embeddings import count_tokens  # Use centralized tokenizer

# -------------------------------
# Setup logging
# -------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# -------------------------------
# Normalize URLs
# -------------------------------
def normalize_url(url: str) -> str:
    parsed = urlparse(url)
    return urlunparse(parsed._replace(fragment="", query=""))

# -------------------------------
# Extract sections from HTML
# -------------------------------
def extract_sections(soup: BeautifulSoup, min_tokens: int = 50):
    for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
        tag.decompose()

    body = soup.body
    if not body:
        return []

    sections = []
    block_tags = ['p', 'li', 'section', 'div', 'article', 'main']

    for element in body.find_all(block_tags + ['h1','h2','h3','h4','h5','h6'], recursive=True):
        if element.name.startswith('h'):
            current_header = element.get_text(strip=True) or "Untitled"
            h_level = int(element.name[1])
            current_text = []

            for sibling in element.find_next_siblings():
                if sibling.name and sibling.name.startswith('h'):
                    break
                if sibling.name in block_tags:
                    text = sibling.get_text(" ", strip=True)
                    if text:
                        current_text.append(' '.join(text.split()))

            section_text = ' '.join(current_text).strip()
            token_count = count_tokens(section_text)
            if token_count >= min_tokens:
                sections.append({
                    'section_title': current_header,
                    'h_level': h_level,
                    'text': section_text
                })
            else:
                logging.debug(f"Section '{current_header}' skipped (tokens: {token_count})")

    # Fallback: If no sections found, extract all visible text from body
    if not sections:
        all_text = body.get_text(" ", strip=True)
        all_text = ' '.join(all_text.split())
        token_count = count_tokens(all_text)
        if token_count >= min_tokens:
            sections.append({
                'section_title': "No Section Title",
                'h_level': 0,
                'text': all_text
            })

    return sections

def extract_page_text(soup: BeautifulSoup) -> str:
    # Remove unwanted tags
    for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
        tag.decompose()
    body = soup.body
    if not body:
        return ""
    # Get all visible text from body
    text = body.get_text(" ", strip=True)
    return ' '.join(text.split())

# -------------------------------
# Crawl function
# -------------------------------
def crawl(
    start_url: str,
    max_pages: int = 50,
    delay: float = 1.0,
    max_depth: int = None,
    max_retries: int = 3
):
    visited = set()
    queue = deque([(start_url, 0)])
    pages_scraped = 0
    results = []

    while queue and (max_pages is None or pages_scraped < max_pages):
        url, depth = queue.popleft()
        norm_url = normalize_url(url)
        if norm_url in visited or (max_depth is not None and depth > max_depth):
            continue

        for attempt in range(max_retries):
            try:
                headers = {'User-Agent': 'Mozilla/5.0 (compatible; CrawlerBot/1.0)'}
                response = requests.get(url, timeout=5, headers=headers)
                response.raise_for_status()
                break
            except Exception as e:
                wait_time = 2 ** attempt
                logging.warning(f"Attempt {attempt+1} failed for {url}: {e}. Retrying in {wait_time}s...")
                time.sleep(wait_time)
        else:
            logging.error(f"Failed to fetch {url} after {max_retries} attempts")
            continue

        visited.add(norm_url)
        soup = BeautifulSoup(response.text, 'html.parser')
        page_text = extract_page_text(soup)

        results.append({
            'url': url,
            'section_title': "Full Page",
            'h_level': 0,
            'text': page_text
        })

        pages_scraped += 1
        if pages_scraped % 5 == 0:
            logging.info(f"Scraped {pages_scraped} pages...")

        for link in soup.find_all('a', href=True):
            next_url = urljoin(url, link['href'])
            norm_next = normalize_url(next_url)
            if urlparse(norm_next).netloc == urlparse(start_url).netloc and norm_next not in visited:
                queue.append((norm_next, depth + 1))

        time.sleep(delay)

    logging.info(f"Crawling complete. {pages_scraped} pages scraped.")
    return results
