from .services import GeolocationService

class GeolocationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.geo = GeolocationService.get_geo_by_request(request)
        
        response = self.get_response(request)
        return response
