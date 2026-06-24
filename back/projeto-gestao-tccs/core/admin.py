from django.contrib import admin
from .models import UnidadeAcademica, Departamento, Curso, Aluno, Professor, TCC

@admin.register(UnidadeAcademica)
class UnidadeAcademicaAdmin(admin.ModelAdmin):
    list_display = ('nome', 'sigla')

@admin.register(Departamento)
class DepartamentoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'sigla', 'unidade_academica')

@admin.register(Curso)
class CursoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'sigla', 'codigo')

@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'matricula', 'curso')

@admin.register(Professor)
class ProfessorAdmin(admin.ModelAdmin):
    list_display = ('nome', 'departamento')

@admin.register(TCC)
class TCCAdmin(admin.ModelAdmin):
    list_display = ('titulo', 'aluno', 'orientador', 'status', 'tipo', 'semestre_letivo_defesa')
    list_filter = ('status', 'tipo', 'semestre_letivo_defesa', 'idioma')
    search_fields = ('titulo', 'resumo', 'palavras_chave')
