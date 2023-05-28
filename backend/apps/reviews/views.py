import io
from datetime import datetime, timedelta

import pandas as pd
from django.db import transaction
from django.db.models import Q, Avg, Count
from django.db.models.functions import TruncMonth, TruncDay, TruncYear, TruncWeek
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.reviews.filters import ReviewFilter
from apps.reviews.models import Review, ReviewCategory
from apps.reviews.serializers import ReviewSerializer, ReviewCategorySerializer
from apps.reviews.services import ReviewClassifierService
from utils.pagination import CustomLimitOffsetPagination


@api_view(["POST"])
@permission_classes([IsAdminUser])
@transaction.atomic
def import_dataset_view(request: Request):
    file = request.data.get("file")

    if not file:
        raise ValidationError("file обязательное поле")

    file_extension = file.name.split('.')[-1].lower()

    if file_extension not in ["xlsx", "xls"]:
        raise ValidationError("Недопустимый формат файла")

    limit = None
    try:
        limit = int(request.data.get("limit", 0))
    except ValueError:
        raise ValidationError("limit должен быть целым числом")

    df = pd.read_excel(io.BytesIO(file.read()))
    service = ReviewClassifierService()
    service.import_reviews_from_dataframe(df=df, limit=limit)
    return Response("ok")


class ReviewViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ReviewSerializer
    pagination_class = CustomLimitOffsetPagination
    filterset_class = ReviewFilter
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend]
    ordering_fields = ['date', 'rating']
    search_fields = ['id', 'postamat__address', 'user_phone']
    queryset = Review.objects.all()

    def _round_value(self, number: int = None, n_digits: int = 1):
        if number is not None:
            return round(number, n_digits)
        return number

    @action(detail=False, url_path=r'avg-rating-series')
    def avg_rating_series(self, request: Request):
        period = request.query_params.get("period")
        last_year = datetime.today() - timedelta(days=365)
        last_month = datetime.today() - timedelta(days=30)
        last_week = datetime.today() - timedelta(days=7)
        q = Review.objects

        postamat_id = request.query_params.get("postamat_id")
        if postamat_id:
            q = q.filter(postamat_id=postamat_id)

        q_region_ids = Q()
        region_ids = self.request.query_params.get("region_ids")
        if region_ids:
            for region_id in region_ids.split(","):
                q_region_ids |= Q(postamat__district__region_id=region_id)

        q_districts_ids = Q()
        district_ids = self.request.query_params.get("district_ids")
        if district_ids:
            for district_id in district_ids.split(","):
                q_districts_ids |= Q(postamat__district_id=district_id)

        q = q.filter(q_region_ids & q_districts_ids)

        if period == "year":
            q = q.filter(date__gte=last_year).annotate(period=TruncMonth('date'))
        elif period == "month":
            q = q.filter(date__gte=last_month).annotate(period=TruncWeek('date'))
        elif period == "week":
            q = q.filter(date__gte=last_week).annotate(period=TruncDay('date'))
        else:
            q = q.annotate(period=TruncMonth('date'))

        q = q.values('period').annotate(avg_rating=Avg('rating'))

        result = [{
            'period': item['period'].strftime("%d.%m.%Y"),
            'avg_rating': round(item['avg_rating'], 1)
        } for item in list(q)]

        return Response(result)

    @action(detail=False, url_path=r'avg-rating')
    def avg_rating(self, request: Request):
        last_year = datetime.today() - timedelta(days=365)
        last_month = datetime.today() - timedelta(days=30)
        last_week = datetime.today() - timedelta(days=7)

        year_avg = Review.objects.filter(date__gte=last_year).aggregate(Avg("rating"))['rating__avg']
        month_avg = Review.objects.filter(date__gte=last_month).aggregate(Avg("rating"))['rating__avg']
        week_avg = Review.objects.filter(date__gte=last_week).aggregate(Avg("rating"))['rating__avg']

        return Response({
            'year_avg': self._round_value(year_avg, 1),
            'month_avg': self._round_value(month_avg, 1),
            'week_avg': self._round_value(week_avg, 1)
        })

    def _get_period_start(self):
        period = self.request.query_params.get("period")

        if period == "year":
            return datetime.today() - timedelta(days=365)
        elif period == "month":
            return datetime.today() - timedelta(days=30)
        elif period == "week":
            return datetime.today() - timedelta(days=7)

        return datetime.today() - timedelta(days=9999)

    def get_queryset(self):
        q_category_ids = Q()
        category_ids = self.request.query_params.get("category_ids")
        if category_ids:
            for category_id in category_ids.split(","):
                q_category_ids |= Q(categories=category_id)

        q_source_ids = Q()
        source_ids = self.request.query_params.get("source_ids")
        if source_ids:
            for source_id in source_ids.split(","):
                q_source_ids |= Q(source_id=source_id)

        q_period = Q(date__gte=self._get_period_start())

        q_postamat_id = Q()
        postamat_id = self.request.query_params.get("postamat_id")
        if postamat_id:
            q_postamat_id = Q(postamat_id=postamat_id)

        q_region_ids = Q()
        region_ids = self.request.query_params.get("region_ids")
        if region_ids:
            for region_id in region_ids.split(","):
                q_region_ids |= Q(postamat__district__region_id=region_id)

        q_districts_ids = Q()
        district_ids = self.request.query_params.get("district_ids")
        if district_ids:
            for district_id in district_ids.split(","):
                q_districts_ids |= Q(postamat__district_id=district_id)

        return self.queryset.filter(
            q_category_ids & q_period & q_postamat_id & q_region_ids & q_districts_ids & q_source_ids
        ).distinct()


class ReviewCategoryViewSet(ModelViewSet):
    serializer_class = ReviewCategorySerializer
    permission_classes = [IsAuthenticated]
    queryset = ReviewCategory.objects.all()

    def _get_period_start(self):
        period = self.request.query_params.get("period")

        if period == "year":
            return datetime.today() - timedelta(days=365)
        elif period == "month":
            return datetime.today() - timedelta(days=30)
        elif period == "week":
            return datetime.today() - timedelta(days=7)

        return datetime.today() - timedelta(days=9999)

    @action(detail=False, url_path=r'applied-count')
    def applied_count(self, request: Request):
        q = Q(review__date__gte=self._get_period_start())

        postamat_id = request.query_params.get("postamat_id")
        if postamat_id:
            q &= Q(review__postamat_id=postamat_id)

        q_region_ids = Q()
        region_ids = self.request.query_params.get("region_ids")
        if region_ids:
            for region_id in region_ids.split(","):
                q_region_ids |= Q(review__postamat__district__region_id=region_id)

        q_districts_ids = Q()
        district_ids = self.request.query_params.get("district_ids")
        if district_ids:
            for district_id in district_ids.split(","):
                q_districts_ids |= Q(review__postamat__district_id=district_id)

        q &= q_districts_ids & q_region_ids

        result = ReviewCategory.objects\
            .values('id', 'name')\
            .annotate(count=Count('review__categories', filter=Q(q)))

        return Response(result)


@api_view(["POST"])
@transaction.atomic
def add_review_view(request: Request):
    comment = request.data.get("comment")
    rating = request.data.get("rating")
    postamat_id = request.data.get("postamat_id")
    user_name = request.data.get("user_name")
    user_phone = request.data.get("user_phone")

    review = Review.objects.create(
        comment=comment,
        rating=rating,
        postamat_id=postamat_id,
        user_name=user_name,
        user_phone=user_phone,
        source_id=3,
        date=datetime.now()
    )

    service = ReviewClassifierService()
    service.classify_reviews([review])

    serializer = ReviewSerializer(review)
    return Response(serializer.data)
