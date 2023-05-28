import os
import pickle
import random
import re
from typing import List

import numpy as np
import tensorflow as tf
from django.conf import settings
from django.utils import timezone
from keras.utils import pad_sequences
from pandas import DataFrame

from apps.houses.models import House
from apps.reviews.models import Review, ReviewSource
from apps.tasks.models import TaskCategory, Task
from datetime import datetime, timedelta

from data.mock_data import USER_NAMES


class ReviewClassifierService:
    TOKENIZER_FILE = "data/tokenizer_2.pickle"
    MODEL_FILE = "data/model_2.h5"
    CATEGORY_PREDICTION_THRESHOLD = 0.2
    TASK_CREATION_THRESHOLD = 0.8

    def __init__(self):
        # pass
        tokenizer_file_path = os.path.join(settings.BASE_DIR, self.TOKENIZER_FILE)
        with open(tokenizer_file_path, 'rb') as handle:
            self.tokenizer = pickle.load(handle)

        self.model = tf.keras.models.load_model(self.MODEL_FILE)

    def import_reviews_from_dataframe(self,
                                      df: DataFrame,
                                      limit: int):
        # pass
        Review.objects.all().delete()
        reviews: List[Review] = []
        houses = House.objects.all()
        sources = ReviewSource.objects.all()

        if limit:
            df = df.head(limit)

        index = 0
        for _, row in df.iterrows():
            comment = row[0]
            date = self._get_random_date()
            rating = row[2]
            reviews.append(Review(
                comment=comment,
                date=date,
                rating=rating,
                source=random.choice(sources),
                postamat=houses[index % len(houses)],
                user_name=USER_NAMES[index % len(USER_NAMES)],
                user_phone=f"+79{random.randint(100000000, 999999999)}"
            ))
            index += 1

        Review.objects.bulk_create(reviews)
        reviews = Review.objects.all()
        self.classify_reviews(reviews)

    def classify_reviews(self, reviews: List[Review]):
        ReviewCategory = Review.categories.through
        categories: List[ReviewCategory] = []
        tasks: List[Task] = []
        comments = [review.comment for review in reviews]
        task_category_map = {t.review_category_id: t.id for t in TaskCategory.objects.all()}

        sequence = self.tokenizer.texts_to_sequences(comments)
        padded_sequence = pad_sequences(sequence, maxlen=100)
        predictions = self.model.predict(padded_sequence)

        for index, prediction in enumerate(predictions):
            review = reviews[index]
            prediction_args = tf.argsort(prediction, direction='DESCENDING').numpy()
            prediction_args = prediction_args[
                np.where(prediction[prediction_args] > self.CATEGORY_PREDICTION_THRESHOLD)
            ]
            for arg in prediction_args:
                category_id = arg + 1

                if category_id == 8 and review.rating < 4:
                    continue

                if category_id == 9 and review.rating > 3:
                    continue

                categories.append(
                    ReviewCategory(review_id=review.id, reviewcategory_id=category_id)
                )
                task_category_id = task_category_map.get(category_id)
                if (
                    review.rating <= 2
                    and task_category_id
                    and prediction[arg] > self.TASK_CREATION_THRESHOLD
                ):
                    status = random.choice([s[0] for s in Task.TaskStatus.choices])
                    if len(reviews) == 1:
                        status = "open"
                    tasks.append(Task(
                        id=f"T-{review.id}",
                        review=review,
                        category_id=task_category_id,
                        status=status,
                        created_at=review.date
                    ))

        ReviewCategory.objects.bulk_create(categories)
        Task.objects.bulk_create(tasks)
        tf.keras.backend.clear_session()

    def _get_random_date(self):
        start = timezone.now() - timedelta(days=500)
        end = timezone.now()
        return start + timedelta(
            seconds=random.randint(0, int((end - start).total_seconds()))
        )
