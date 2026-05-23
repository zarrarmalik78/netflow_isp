from django.urls import path
from . import views

app_name = 'ai_engine'

urlpatterns = [
    path('analyzer/', views.analyzer_view, name='analyzer'),
]
