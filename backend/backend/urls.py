from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.conf import settings
from django.conf.urls.static import static

def home(request):
    return JsonResponse({"message": "Welcome to HopyfyCart API!"})

urlpatterns = [
    path('', home),  # 👈 This line adds the root route
    path('admin/', admin.site.urls),
    path('api/', include('main.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
