from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UnidadeAcademicaViewSet, DepartamentoViewSet, CursoViewSet, 
    AlunoViewSet, ProfessorViewSet, TCCViewSet
)

router = DefaultRouter()
router.register(r'unidades-academicas', UnidadeAcademicaViewSet)
router.register(r'departamentos', DepartamentoViewSet)
router.register(r'cursos', CursoViewSet)
router.register(r'alunos', AlunoViewSet)
router.register(r'professores', ProfessorViewSet)
router.register(r'tccs', TCCViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
