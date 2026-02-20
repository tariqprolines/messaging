"""
Background task for retrying failed messages
"""
from app.tasks.celery_app import celery_app


@celery_app.task
def retry_failed_messages():
    """
    Background task to retry failed messages
    """
    # TODO: Implement retry logic for failed messages
    pass
