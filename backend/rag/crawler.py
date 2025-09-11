import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse, urlunparse
from collections import deque
import csv
import io
import time
from transformers import AutoTokenizer

# -------------------------------
# Hugging Face tokenizer for MiniLM
# -------------------------------
tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

def count_tokens(text):
    return len(tokenizer.encode(text, add_special_tokens=False))

# -------------------------------
# Normalize URLs
# -------------------------------
def normalize_url(url):
    parsed = urlparse(url)
    # Remove fragment and query
    normalized = parsed._replace(fragment="", query="")
    # Standardize trailing slash
    path = normalized.path
    if not path.endswith("/"):
        path += "/"
    normalized = normalized._replace(path=path)
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
    current_section_text = []
    current_header = None
    current_hlevel = 0

    # Consider block-level tags: p, div, li, section
    block_tags = ['p', 'div', 'li', 'section']

    for element in body.descendants:
        if element.name in ['h1','h2','h3','h4','h5','h6']:
            # Save previous section if long enough
            if current_section_text:
                section_text = ' '.join(current_section_text).strip()
                if count_tokens(section_text) >= min_tokens:
                    sections.append({
                        'section_title': current_header if current_header else "Untitled",
                        'h_level': current_hlevel,
                        'text': section_text
                    })
            # Start new section
            current_header = element.get_text(strip=True)
            current_hlevel = int(element.name[1])
            current_section_text = []
        elif element.name in block_tags or (hasattr(element, 'get_text') and element.get_text(strip=True)):
            text = element.get_text(strip=True)
            if text:
                # Clean whitespace
                text = ' '.join(text.split())
                current_section_text.append(text)

    # Add last section
    if current_section_text:
        section_text = ' '.join(current_section_text).strip()
        if count_tokens(section_text) >= min_tokens:
            sections.append({
                'section_title': current_header if current_header else "Untitled",
                'h_level': current_hlevel,
                'text': section_text
            })

    return sections

# -------------------------------
# Crawl function
# -------------------------------
def crawl(start_url, max_pages=50, min_tokens=50, delay=1, max_depth=None):
    visited = set()
    queue = deque([(start_url, 0)])  # tuple of (url, depth)
    results = []

    while queue:
        url, depth = queue.popleft()
        norm_url = normalize_url(url)
        if norm_url in visited:
            continue
        if max_depth is not None and depth > max_depth:
            continue

        try:
            headers = {'User-Agent': 'Mozilla/5.0 (compatible; CrawlerBot/1.0)'}
            response = requests.get(url, timeout=5, headers=headers)
            if response.status_code != 200:
                continue
            visited.add(norm_url)
            soup = BeautifulSoup(response.text, 'html.parser')
            sections = extract_sections(soup, min_tokens=min_tokens)

            # Add sections to results
            for sec in sections:
                results.append({
                    'url': url,
                    'section_title': sec['section_title'],
                    'h_level': sec['h_level'],
                    'text': sec['text']
                })

            # Polite crawling
            time.sleep(delay)

            # Print progress every 5 pages
            if len(visited) % 5 == 0:
                print(f"Scraped {len(visited)} pages...")

            # Queue internal links
            for link in soup.find_all('a', href=True):
                next_url = urljoin(url, link['href'])
                norm_next = normalize_url(next_url)
                if urlparse(norm_next).netloc == urlparse(start_url).netloc:
                    if norm_next not in visited:
                        queue.append((next_url, depth + 1))

            if max_pages is not None and len(visited) >= max_pages:
                break

        except Exception as e:
            print(f"Failed to fetch {url}: {e}")

    # Write results to in-memory CSV
    output = io.StringIO()
    fieldnames = ['url', 'section_title', 'h_level', 'text']
    writer = csv.DictWriter(output, fieldnames=fieldnames)
    writer.writeheader()
    for item in results:
        writer.writerow(item)
    output.seek(0)
    return output.getvalue()

# # -------------------------------
# # Example usage
# # -------------------------------
# if __name__ == "__main__":
#     start_url = "https://books.toscrape.com/"
#     csv_data = crawl(start_url, max_pages=20, min_tokens=50, delay=1, max_depth=2)
#     with open("support_pages.csv", "w", encoding="utf-8", newline="") as f:
#         f.write(csv_data)
#     print("Crawling complete. CSV saved.")
