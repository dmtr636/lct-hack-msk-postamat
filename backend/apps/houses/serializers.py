from rest_framework.relations import PrimaryKeyRelatedField
from rest_framework.serializers import ModelSerializer

from apps.houses.models import House, District, Region


class HouseSerializer(ModelSerializer):
    district_id = PrimaryKeyRelatedField(source='district', read_only=True)

    class Meta:
        model = House
        fields = ['id', 'address', 'district_id']


class DistrictSerializer(ModelSerializer):
    region_id = PrimaryKeyRelatedField(source='region', read_only=True)

    class Meta:
        model = District
        fields = ['id', 'name', 'region_id']


class RegionSerializer(ModelSerializer):
    class Meta:
        model = Region
        fields = ['id', 'name']
