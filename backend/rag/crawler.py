import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from collections import deque
import csv
import io

def extract_text(soup):
    # Remove script and style elements
    for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
        tag.decompose()
    # Get text from body
    body = soup.body
    if body:
        text = body.get_text(separator=' ', strip=True)
        return text
    return ""

def crawl(start_url, max_pages=50):
    visited = set()
    queue = deque([start_url])
    results = []

    while queue:
        if max_pages is not None and len(visited) >= max_pages:
            break
        url = queue.popleft()
        if url in visited:
            continue
        try:
            response = requests.get(url, timeout=5)
            if response.status_code != 200:
                continue
            visited.add(url)
            soup = BeautifulSoup(response.text, 'html.parser')
            page_text = extract_text(soup)
            results.append({'url': url, 'text': page_text})

            # Print progress every 5 pages
            if len(visited) % 5 == 0:
                print(f"Scraped {len(visited)} pages...")

            for link in soup.find_all('a', href=True):
                next_url = urljoin(url, link['href'])
                # Only crawl pages within the same domain
                if urlparse(next_url).netloc == urlparse(start_url).netloc:
                    if next_url not in visited and next_url not in queue:
                        queue.append(next_url)
        except Exception as e:
            print(f"Failed to fetch {url}: {e}")

    # Write results to an in-memory CSV and return it
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=['url', 'text'])
    writer.writeheader()
    for item in results:
        writer.writerow(item)
    output.seek(0)
    return output.getvalue()