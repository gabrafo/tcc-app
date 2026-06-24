from django.db import models

class UnidadeAcademica(models.Model):
    nome = models.CharField(max_length=255)
    sigla = models.CharField(max_length=10, unique=True)

    def __str__(self):
        return f"{self.nome} ({self.sigla})"

class Departamento(models.Model):
    nome = models.CharField(max_length=255)
    sigla = models.CharField(max_length=10, unique=True)
    unidade_academica = models.ForeignKey(UnidadeAcademica, on_delete=models.CASCADE, related_name='departamentos')

    def __str__(self):
        return f"{self.nome} ({self.sigla})"

class Curso(models.Model):
    nome = models.CharField(max_length=255)
    sigla = models.CharField(max_length=10, unique=True)
    codigo = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return f"{self.nome} ({self.codigo})"

class Aluno(models.Model):
    nome = models.CharField(max_length=255)
    matricula = models.CharField(max_length=50, unique=True)
    curso = models.ForeignKey(Curso, on_delete=models.CASCADE, related_name='alunos')

    def __str__(self):
        return f"{self.nome} ({self.matricula})"

class Professor(models.Model):
    nome = models.CharField(max_length=255)
    departamento = models.ForeignKey(Departamento, on_delete=models.CASCADE, related_name='professores')

    def __str__(self):
        return f"{self.nome} ({self.departamento.sigla})"

class TCC(models.Model):
    STATUS_CHOICES = [
        ('0', 'Em Elaboração'),
        ('1', 'Enviado'),
        ('2', 'Aprovado'),
        ('3', 'Reprovado'),
    ]

    TIPO_CHOICES = [
        ('MONOGRAFIA', 'Monografia'),
        ('RELATORIO_ESTAGIO', 'Relatório de Estágio'),
        ('RELATORIO_TECNICO', 'Relatório Técnico'),
        ('ARTIGO', 'Artigo'),
    ]

    IDIOMA_CHOICES = [
        ('PT', 'Português'),
        ('EN', 'Inglês'),
    ]

    SEMESTRE_CHOICES = [
        ('2020/1', '2020/1'),
        ('2020/2', '2020/2'),

        ('2021/1', '2021/1'),
        ('2021/2', '2021/2'),
        
        ('2022/1', '2022/1'),
        ('2022/2', '2022/2'),

        ('2023/1', '2023/1'),
        ('2023/2', '2023/2'),

        ('2024/1', '2024/1'),
        ('2024/2', '2024/2'),
        
        ('2025/1', '2025/1'),
        ('2025/2', '2025/2'),

        ('2026/1', '2026/1'),
    ]

    titulo = models.CharField(max_length=255)
    resumo = models.TextField()
    palavras_chave = models.CharField(max_length=255)
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    idioma = models.CharField(max_length=2, choices=IDIOMA_CHOICES)
    
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='tccs')
    orientador = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='tccs_orientados')
    coorientador = models.ForeignKey(Professor, on_delete=models.SET_NULL, related_name='tccs_coorientados', null=True, blank=True)
    
    presidente = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='tccs_presididos')
    primeiro_membro = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='tccs_membro1')
    segundo_membro = models.ForeignKey(Professor, on_delete=models.CASCADE, related_name='tccs_membro2')
    
    semestre_letivo_defesa = models.CharField(max_length=10, choices=SEMESTRE_CHOICES, null=True, blank=True)
    
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='0')
    arquivo = models.FileField(upload_to='tccs/', null=True, blank=True)

    def __str__(self):
        return self.titulo
