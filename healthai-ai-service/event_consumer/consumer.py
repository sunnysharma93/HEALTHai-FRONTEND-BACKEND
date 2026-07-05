from kafka import KafkaConsumer
from config.settings import settings
from services.rag_service import rag_service
import json
import logging
import threading

logger = logging.getLogger(__name__)

class WorkoutEventConsumer:
    def __init__(self):
        self.consumer = None
        self.running = False

    def start(self):
        try:
            self.consumer = KafkaConsumer(
                'workout-logged',
                bootstrap_servers=settings.KAFKA_SERVERS,
                auto_offset_reset='earliest',
                group_id='ai-service-group',
                value_deserializer=lambda x:
                    json.loads(x.decode('utf-8'))
            )
            self.running = True

            # Background thread mein chalao
            thread = threading.Thread(
                target=self._consume)
            thread.daemon = True
            thread.start()

            logger.info("Kafka consumer started!")

        except Exception as e:
            logger.error(f"Kafka connect error: {e}")
            logger.info("Kafka ke bina chal raha hai!")

    def _consume(self):
        for message in self.consumer:
            if not self.running:
                break
            try:
                event = message.value
                logger.info(
                    f"Workout event mila: {event}")

                # User workout data RAG mein save karo
                data = (
                    f"User {event.get('email')} ne "
                    f"{event.get('exerciseName')} kiya "
                    f"{event.get('durationMins')} minutes, "
                    f"{event.get('caloriesBurned')} calories burned"
                )
                rag_service.add_user_data(
                    event.get('email'), data)

            except Exception as e:
                logger.error(f"Event process error: {e}")

    def stop(self):
        self.running = False
        if self.consumer:
            self.consumer.close()

# Singleton
workout_consumer = WorkoutEventConsumer()