"""
Background task for sending messages
"""
from app.tasks.celery_app import celery_app
from app.services.message_provider import message_provider


@celery_app.task(bind=True, max_retries=3)
def send_message_task(self, to: str, content: str, message_id: int):
    """
    Background task to send a message via message provider
    """
    # TODO: Implement message sending logic
    # This will be called asynchronously by Celery workers
    try:
        result = message_provider.send_message(to, content)
        return {"status": "sent", "provider_message_id": result.get("id")}
    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
