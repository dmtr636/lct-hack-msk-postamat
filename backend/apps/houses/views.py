import io
import random
from typing import List

import pandas as pd
from django.db import transaction
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from apps.houses.models import House, Region, District
from apps.houses.serializers import HouseSerializer, DistrictSerializer, RegionSerializer
from data.mock_data import REGIONS, DISTRICTS
from utils.pagination import CustomLimitOffsetPagination


@api_view(["POST"])
@permission_classes([IsAdminUser])
@transaction.atomic
def import_house_registry_view(request: Request):
    file = request.data.get("file")

    if not file:
        raise ValidationError("file обязательное поле")

    file_extension = file.name.split('.')[-1].lower()

    if file_extension not in ["xlsx", "xls"]:
        raise ValidationError("Недопустимый формат файла")

    df = pd.read_excel(io.BytesIO(file.read()))

    Region.objects.all().delete()
    District.objects.all().delete()
    House.objects.all().delete()

    regions: List[Region] = [
        Region(name=name) for name in REGIONS
    ]
    Region.objects.bulk_create(regions)
    regions = Region.objects.all()

    districts: List[District] = []

    for index, name in enumerate(DISTRICTS):
        districts.append(District(name=name, region=regions[index % len(regions)]))

    District.objects.bulk_create(districts)
    districts = District.objects.all()

    houses: List[House] = []
    index = 0
    for _, row in df.head(100).iterrows():
        address = row[2]
        houses.append(House(id=f"P-{5000+index}", address=address, district=districts[index % len(districts)]))
        index += 1

    House.objects.bulk_create(houses)

    return Response("ok")


class HouseViewSet(ModelViewSet):
    serializer_class = HouseSerializer
    permission_classes = [IsAuthenticated]
    queryset = House.objects.all()


class DistrictViewSet(ModelViewSet):
    serializer_class = DistrictSerializer
    permission_classes = [IsAuthenticated]
    queryset = District.objects.all()


class RegionViewSet(ModelViewSet):
    serializer_class = RegionSerializer
    permission_classes = [IsAuthenticated]
    queryset = Region.objects.all()
