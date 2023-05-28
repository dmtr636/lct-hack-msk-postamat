from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    #if not response:
        #return Response({'error': 'Неизвестная ошибка', 'error_detail': str(exc)})

    error_data = response.data

    if isinstance(error_data, dict):
        if "detail" in error_data:
            error_data = error_data["detail"]

    if isinstance(error_data, list):
        error_data = error_data[0]

    response.data = {
        "error": error_data
    }

    return response
