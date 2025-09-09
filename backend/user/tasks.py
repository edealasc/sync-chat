from celery import shared_task
from rag.crawler import crawl
from rag.embeddings import create_embeddings_from_csv

@shared_task
def crawl_and_embed(bot_id, website_url):
    from .models import Bot
    bot = Bot.objects.get(id=bot_id)
    csv_data = crawl(website_url)
    # Use the bot's unique collection name
    create_embeddings_from_csv(
        csv_data,
        collection_name=bot.collection_name or f"bot_{bot.id}_collection"
    )
    bot.status = 'active'
    # Ensure collection_name is set
    if not bot.collection_name:
        bot.collection_name = f"bot_{bot.id}_collection"
    bot.save()
    return True