from django.urls import path, include, re_path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("data/", csrf_exempt(views.PostDataAPI.as_view())),
    path('graphs/<username>', views.ESPDataAPI.as_view()),
    path('download/graphs/<username>', views.GetDownloadData.as_view())
]
urlpatterns = format_suffix_patterns(urlpatterns)
