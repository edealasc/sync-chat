from celery import shared_task
from rag.crawler import crawl
from rag.embeddings import create_embeddings_from_dicts

@shared_task
def crawl_and_embed(bot_id, website_url):
    from .models import Bot
    bot = Bot.objects.get(id=bot_id)
    scraped_data = crawl(website_url)
    create_embeddings_from_dicts(
        scraped_data,
        collection_name=bot.collection_name or f"bot_{bot.id}_collection"
    )
    bot.status = 'active'
    if not bot.collection_name:
        bot.collection_name = f"bot_{bot.id}_collection"
    bot.save()
    return True