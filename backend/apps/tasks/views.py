from datetime import datetime, timedelta

from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.tasks.models import Task, TaskCategory
from apps.tasks.serializers import TaskSerializer, TaskCategorySerializer
from utils.pagination import CustomLimitOffsetPagination


class TaskViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = TaskSerializer
    pagination_class = CustomLimitOffsetPagination
    filter_backends = [filters.OrderingFilter, filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['status', 'id', 'created_at', 'review__categories']
    ordering_fields = ['created_at']
    search_fields = ['id', 'review__postamat__address', 'review__user_phone']
    queryset = Task.objects.all()

    @action(detail=True, url_path=r'set-status', methods=["POST"])
    def set_status(self, request: Request, pk=None):
        task = self.get_object()
        task.status = request.data.get("status", "open")
        task.save()
        return Response()

    def get_queryset(self):
        q_category_ids = Q()
        category_ids = self.request.query_params.get("category_ids")
        if category_ids:
            for category_id in category_ids.split(","):
                q_category_ids |= Q(review__categories=category_id)

        q_postamat_id = Q()
        postamat_id = self.request.query_params.get("postamat_id")
        if postamat_id:
            q_postamat_id = Q(review__postamat_id=postamat_id)

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

        return self.queryset.filter(
            q_category_ids & q_postamat_id & q_region_ids & q_districts_ids
        ).distinct()


class TaskCategoryViewSet(ModelViewSet):
    serializer_class = TaskCategorySerializer
    permission_classes = [IsAuthenticated]
    queryset = TaskCategory.objects.all()

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
        q = Q(task__created_at__gte=self._get_period_start())

        postamat_id = request.query_params.get("postamat_id")
        if postamat_id:
            q &= Q(task__review__postamat_id=postamat_id)

        q_region_ids = Q()
        region_ids = self.request.query_params.get("region_ids")
        if region_ids:
            for region_id in region_ids.split(","):
                q_region_ids |= Q(task__review__postamat__district__region_id=region_id)

        q_districts_ids = Q()
        district_ids = self.request.query_params.get("district_ids")
        if district_ids:
            for district_id in district_ids.split(","):
                q_districts_ids |= Q(task__review__postamat__district_id=district_id)

        q &= q_districts_ids & q_region_ids

        result = TaskCategory.objects \
            .values('id', 'name') \
            .annotate(count=Count('task', filter=Q(q)))

        return Response(result)
