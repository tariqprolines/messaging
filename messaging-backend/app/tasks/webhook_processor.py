"""
Background task for processing webhook callbacks
"""
from app.tasks.celery_app import celery_app


@celery_app.task
def process_webhook(webhook_data: dict):
    """
    Background task to process webhook callbacks from message provider
    """
    # TODO: Implement webhook processing logic
    pass
