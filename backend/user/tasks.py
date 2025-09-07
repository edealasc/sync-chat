from celery import shared_task
from rag.crawler import crawl
from rag.embeddings import create_embeddings_from_csv

@shared_task
def crawl_and_embed(bot_id, website_url):
    # Crawl website and get CSV data
    csv_data = crawl(website_url)
    # Create embeddings from CSV data
    embeddings = create_embeddings_from_csv(csv_data)
    # Save results to DB or file as needed
    from .models import Bot
    bot = Bot.objects.get(id=bot_id)
    bot.status = 'active'
    bot.save()
    # Optionally store embeddings somewhere
    return True