from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response


class CustomLimitOffsetPagination(LimitOffsetPagination):
    def get_paginated_response(self, data):
        print(self.limit)
        if self.limit == -1:
            return Response({
                'count': len(data),
            })
        return Response({
            'count': len(data),
            'total_count': self.count,
            'result': data
        })
