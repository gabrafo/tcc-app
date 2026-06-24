import os
import django
import random

# Configuração do ambiente Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tcc_project.settings')
django.setup()

from core.models import UnidadeAcademica, Departamento, Curso, Aluno, Professor, TCC

def populate():
    print("Limpando banco de dados...")
    TCC.objects.all().delete()
    Aluno.objects.all().delete()
    Professor.objects.all().delete()
    Curso.objects.all().delete()
    Departamento.objects.all().delete()
    UnidadeAcademica.objects.all().delete()
    
    print("Populando o banco de dados...")

    unidade_esal = UnidadeAcademica.objects.create(nome="Escola de Ciências Agrárias de Lavras", sigla="ESAL")
    unidade_eeng = UnidadeAcademica.objects.create(nome="Escola de Engenharia", sigla="EENG")
    unidade_fcs = UnidadeAcademica.objects.create(nome="Faculdade de Ciências da Saúde", sigla="FCS")
    unidade_fcsa = UnidadeAcademica.objects.create(nome="Faculdade de Ciências Sociais Aplicadas", sigla="FCSA")
    unidade_faelch = UnidadeAcademica.objects.create(nome="Faculdade de Filosofia, Ciências Humanas, Educação e Letras", sigla="FAELCH")
    unidade_fzmv = UnidadeAcademica.objects.create(nome="Faculdade de Zootecnia e Medicina Veterinária", sigla="FZMV")
    unidade_ictin = UnidadeAcademica.objects.create(nome="Instituto de Ciência,Tecnologia e Inovação", sigla="ICTIN")
    unidade_icet = UnidadeAcademica.objects.create(nome="Instituto de Ciências Exatas e Tecnológicas", sigla="ICET")
    unidade_icn = UnidadeAcademica.objects.create(nome="Instituto de Ciências Naturais", sigla="ICN")

    depto_dac = Departamento.objects.create(nome="Computação Aplicada", sigla="DAC",
        unidade_academica=unidade_icet)
    depto_dcc = Departamento.objects.create(nome="Ciência da Computação", sigla="DCC",
        unidade_academica=unidade_icet)
    depto_des = Departamento.objects.create(nome="Estatística", sigla="DES",
        unidade_academica=unidade_icet)
    depto_dmm = Departamento.objects.create(nome="Matemática e Matemática Aplicada", sigla="DMM",
        unidade_academica=unidade_icet)
    depto_dfm = Departamento.objects.create(nome="Educação em Ciências Físicas e Matemática", sigla="DFM",
        unidade_academica=unidade_icet)
    

    depto_dch = Departamento.objects.create(nome="Ciências Humanas", sigla="DCH",
        unidade_academica=unidade_faelch)
    depto_dbi = Departamento.objects.create(nome="Biologia", sigla="DBI",
        unidade_academica=unidade_icn)
    
    depto_objs = [depto_dac, depto_dcc, depto_des, depto_dmm, depto_dfm, depto_dch, depto_dbi]

    curso_bcc = Curso.objects.create(nome="Ciência da Computação", sigla="BCC", codigo="G010")
    curso_bsi = Curso.objects.create(nome="Sistemas de Informação", sigla="BSI", codigo="G014")
    curso_mat = Curso.objects.create(nome="Matemática", sigla="MAT", codigo="G015")
    curso_fis = Curso.objects.create(nome="Física", sigla="FIS", codigo="G018")

    curso_objs = [curso_bcc, curso_bsi, curso_mat, curso_fis]

    nomes_professores = [
        "Ana Paula Ribeiro",
        "Carlos Eduardo Mendes",
        "Fernanda Oliveira Souza",
        "Ricardo Alves Pereira",
        "Juliana Martins Costa",
        "Marcos Vinícius Teixeira",
        "Patrícia Gomes Andrade",
        "Roberto Nogueira Silva",
        "Camila Fernandes Rocha",
        "Eduardo Henrique Batista",
        "Luciana Carvalho Dias",
        "Gustavo Ribeiro Matos",
        "Daniela Pires Lopes",
        "Felipe Augusto Santana",
        "Renata Farias Moraes",
        "André Luiz Cardoso",
        "Tatiane Rodrigues Barros",
        "Paulo Sérgio Almeida",
        "Vanessa Monteiro Braga",
        "Leonardo Torres Nascimento"
    ]

    nomes_alunos = [
        "Lucas Almeida Santos","Maria Clara Ferreira","João Pedro Costa","Ana Beatriz Martins","Pedro Henrique Oliveira",
        "Larissa Gomes Ribeiro","Gabriel Alves Souza","Isabela Carvalho Lima","Matheus Pereira Rocha","Julia Fernandes Barros",
        "Rafael Nogueira Mendes","Bruna Teixeira Andrade","Guilherme Batista Moraes","Amanda Rodrigues Dias","Daniel Martins Silva",
        "Carolina Farias Costa","Thiago Monteiro Rocha","Beatriz Cardoso Alves","Leonardo Santana Ribeiro","Camila Torres Oliveira",
        "Victor Matos Pereira","Letícia Andrade Gomes","Felipe Costa Barros","Natalia Ferreira Santos","Igor Mendes Carvalho",
        "Mariana Alves Dias","Renan Oliveira Teixeira","Paula Batista Rocha","Gabriela Pires Costa","André Fernandes Lima",
        "Joana Ribeiro Mendes","Diego Cardoso Silva","Luana Teixeira Santos","Bruno Monteiro Dias","Larissa Carvalho Rocha",
        "Mateus Farias Costa","Vitória Gomes Lima","Gustavo Mendes Santos","Bianca Rocha Pereira","Arthur Santana Dias",
        "Eduarda Batista Lima","Caio Fernandes Costa","Alice Andrade Rocha","Rodrigo Matos Silva","Helena Carvalho Dias",
        "Ruan Monteiro Lima","Sophia Teixeira Rocha","Pedro Lucas Mendes","Lívia Santana Costa","Rafaela Batista Lima",
        "Diego Oliveira Santos","Paulo Henrique Rocha","Jéssica Andrade Dias","Ricardo Mendes Costa","Larissa Fernandes Rocha",
        "Marcelo Batista Lima","Vanessa Santana Costa","Luiz Fernando Rocha","Amanda Teixeira Dias","Bruno Costa Mendes",
        "Camila Batista Santos","Igor Fernandes Rocha","Julia Santana Lima","Mateus Costa Dias","Ana Paula Mendes",
        "Rafael Teixeira Rocha","Mariana Batista Lima","Lucas Santana Costa","Beatriz Fernandes Dias","Felipe Rocha Mendes",
        "Carla Batista Santos","João Victor Rocha","Paula Santana Lima","Tiago Costa Dias","Gabriel Fernandes Mendes",
        "Larissa Batista Rocha","Pedro Santana Lima","Carolina Costa Dias","Matheus Fernandes Mendes","Julia Batista Rocha",
        "Leonardo Santana Lima","Amanda Costa Dias","Rafael Fernandes Mendes","Bruna Batista Rocha","Victor Santana Lima",
        "Ana Costa Dias","Felipe Fernandes Mendes","Letícia Batista Rocha","Lucas Santana Lima","Marina Costa Dias",
        "Gustavo Fernandes Mendes","Isabela Batista Rocha","Pedro Santana Dias","Camila Costa Mendes","João Fernandes Rocha",
        "Guilherme Fernandes Mendes","Beatriz Batista Rocha","João Santana Dias","Marcos Costa Mendes","Fernando Rocha"
    ]

    titulos_tcc = [
        "Sistema Web para Gestão Acadêmica",
        "Machine Learning na Previsão de Desempenho Escolar",
        "Sistema de Recomendação de Livros com Inteligência Artificial",
        "Análise de Dados Educacionais com Python",
        "Aplicação Web com Django para Gestão Universitária",
        "Automação de Processos Administrativos com Python",
        "Sistema IoT para Monitoramento de Sensores",
        "Deep Learning para Reconhecimento de Imagens",
        "Chatbot Educacional com Processamento de Linguagem Natural",
        "Sistema de Gestão de Biblioteca Universitária",
        "Análise de Sentimentos em Redes Sociais",
        "Aplicação Web para Gerenciamento de Projetos",
        "Sistema de Recomendação de Filmes",
        "Uso de Big Data na Educação",
        "Plataforma Web para Ensino de Programação",
        "API REST para Sistemas Educacionais",
        "Sistema Inteligente de Controle de Estoque",
        "Visualização Interativa de Dados com Dash",
        "Aplicação de NLP em Análise de Textos",
        "Sistema de Agendamento Online",
        "Plataforma de Ensino Adaptativo",
        "Análise de Dados de Tráfego Urbano",
        "Sistema de Reconhecimento Facial",
        "Redes Neurais para Diagnóstico Médico",
        "Jogo Educacional para Ensino de Lógica",
        "Sistema Web para Gestão de Eventos",
        "Análise de Dados Financeiros com Python",
        "Plataforma de Cursos Online",
        "Sistema de Recomendação de Músicas",
        "Blockchain em Sistemas de Votação",
        "Sistema de Monitoramento Ambiental",
        "Análise de Dados de Saúde Pública",
        "Aplicação Web para Controle de Tarefas",
        "Sistema de Gestão de Clínicas",
        "Inteligência Artificial na Agricultura",
        "Plataforma de Compartilhamento de Conhecimento",
        "Sistema de Detecção de Fraudes",
        "IoT para Casas Inteligentes",
        "Sistema de Gestão de Transporte",
        "Análise de Dados Climáticos",
        "Sistema de Gestão de Restaurantes",
        "Rede Social Acadêmica",
        "Sistema Inteligente de Controle de Acesso",
        "Data Mining aplicado à Educação",
        "Plataforma de Monitoramento de Atividades Físicas",
        "Sistema de Gestão de Projetos Acadêmicos",
        "IA aplicada ao Diagnóstico por Imagem",
        "Sistema de Recomendação de Cursos",
        "Plataforma de Avaliação de Professores",
        "Sistema de Gestão de TCC",
        "IA aplicada a Jogos Digitais",
        "Análise de Dados de Vendas",
        "Sistema de Monitoramento de Energia",
        "Gestão de Condomínios via Web",
        "Sistema de Recomendação de Produtos",
        "Plataforma de Ensino de Matemática",
        "IA na Previsão do Tempo",
        "Sistema de Gestão de Estágios",
        "Plataforma de Compartilhamento de Arquivos",
        "IA em Segurança Digital",
        "Gestão de Pesquisas Acadêmicas",
        "Plataforma de Colaboração Online",
        "Análise Automatizada de Currículos",
        "IA em Imagens Médicas",
        "Monitoramento de Redes Computacionais",
        "Plataforma de Ensino de Idiomas",
        "Recomendação de Artigos Científicos",
        "IA aplicada à Robótica",
        "Sistema de Gestão de Academias",
        "Aprendizado Personalizado com IA",
        "Sistema de Controle de Presença",
        "IA na Previsão de Demanda",
        "Gestão de Projetos de Software",
        "Plataforma de Compartilhamento de Projetos",
        "Trilhas de Aprendizagem Inteligentes",
        "IA em Análise de Vídeos",
        "Monitoramento de Tráfego de Rede",
        "Plataforma de Ensino de Ciência de Dados",
        "Gestão de Laboratórios Universitários",
        "IA em Análise de Texto",
        "Recomendação de Eventos Acadêmicos",
        "Avaliação Online de Cursos",
        "Sistema de Gestão de Documentos",
        "IA em Análise de Logs",
        "Monitoramento de Equipamentos",
        "Plataforma de Ensino de Programação Web",
        "Recomendação de Conteúdo Educacional",
        "IA na Previsão de Vendas",
        "Gestão de Pesquisa Científica",
        "Compartilhamento de Dados Científicos",
        "Análise de Redes Sociais",
        "IA em Diagnóstico de Falhas",
        "Gestão de Bolsas Acadêmicas",
        "Plataforma de Ensino de Inteligência Artificial",
        "Recomendação de Leituras Acadêmicas",
        "IA em Análise de Comportamento",
        "Gestão de Publicações Científicas",
        "Plataforma de Ensino de Computação",
        "Recomendação de Projetos Acadêmicos",
        "IA em Educação Personalizada"
        ]

    resumos = [
        "Este trabalho apresenta o desenvolvimento de um sistema web para gestão acadêmica. A aplicação foi construída com foco em organização, cadastro e consulta de informações institucionais.",
        "A pesquisa investiga o uso de algoritmos de aprendizado de máquina para prever o desempenho escolar. Os resultados indicam que técnicas de classificação podem apoiar a tomada de decisão educacional.",
        "O projeto propõe um sistema de recomendação de livros com base no perfil dos usuários. A solução utiliza dados de preferências para gerar sugestões personalizadas de leitura.",
        "Este estudo realiza uma análise de dados educacionais utilizando Python e bibliotecas de ciência de dados. O objetivo é identificar padrões relevantes no rendimento de estudantes.",
        "O trabalho descreve o desenvolvimento de uma aplicação web com Django para gerenciamento universitário. A plataforma permite cadastrar usuários, cursos e atividades acadêmicas.",
        "A pesquisa apresenta uma solução para automação de processos administrativos com Python. O sistema reduz tarefas repetitivas e melhora a eficiência do fluxo de trabalho.",
        "Este trabalho desenvolve um sistema de monitoramento de sensores com internet das coisas. Os dados coletados são enviados para uma interface web para acompanhamento em tempo real.",
        "O estudo investiga a aplicação de deep learning em reconhecimento de imagens. Foram testadas arquiteturas de redes neurais para classificação automatizada de objetos.",
        "O projeto apresenta um chatbot educacional para responder dúvidas frequentes de alunos. A solução busca ampliar o suporte acadêmico por meio de linguagem natural.",
        "Este trabalho descreve um sistema de gestão de biblioteca universitária. A aplicação permite controlar empréstimos, devoluções e o cadastro de obras e usuários.",
        "A pesquisa analisa sentimentos em publicações de redes sociais com técnicas de processamento de texto. O estudo busca identificar tendências de opinião em grandes volumes de dados.",
        "O projeto propõe uma aplicação web para gerenciamento de projetos. A ferramenta organiza tarefas, prazos e equipes em um ambiente acessível pela internet.",
        "Este trabalho apresenta um sistema de recomendação de filmes baseado em avaliações de usuários. O objetivo é melhorar a experiência de escolha de conteúdos audiovisuais.",
        "A pesquisa discute o uso de big data na educação para apoiar políticas institucionais. Foram exploradas estratégias de coleta, armazenamento e interpretação de dados educacionais.",
        "O projeto desenvolve uma plataforma web voltada ao ensino de programação. A proposta oferece exercícios, exemplos e recursos de apoio ao aprendizado inicial.",
        "Este trabalho apresenta o desenvolvimento de uma API REST para integração entre sistemas acadêmicos. A solução foi construída com foco em escalabilidade e troca padronizada de dados.",
        "A pesquisa propõe um sistema inteligente de controle de estoque para pequenas empresas. O modelo permite registrar entradas, saídas e alertas de reposição de produtos.",
        "O estudo apresenta técnicas de visualização interativa de dados com Dash. A solução facilita a análise de informações por meio de gráficos e painéis dinâmicos.",
        "Este trabalho investiga aplicações de processamento de linguagem natural em análise textual. Foram utilizadas técnicas para extração de informações e classificação de documentos.",
        "O projeto desenvolve um sistema de agendamento online para serviços diversos. A aplicação permite marcações, consultas de horários e gerenciamento de disponibilidade.",
        "A pesquisa apresenta uma plataforma de ensino adaptativo baseada no desempenho do aluno. O sistema ajusta conteúdos e atividades conforme o progresso individual.",
        "Este estudo realiza análise de dados de tráfego urbano com apoio de ferramentas computacionais. O objetivo é identificar padrões de mobilidade e possíveis melhorias na circulação.",
        "O trabalho propõe um sistema de reconhecimento facial para controle de acesso. A solução utiliza visão computacional para autenticação de usuários em ambientes restritos.",
        "A pesquisa investiga o uso de redes neurais no apoio ao diagnóstico médico. O estudo analisa a capacidade dos modelos em classificar exames e auxiliar especialistas.",
        "Este projeto apresenta o desenvolvimento de um jogo educacional para ensino de lógica. A proposta busca tornar o processo de aprendizagem mais interativo e motivador.",
        "O trabalho descreve um sistema web para gestão de eventos acadêmicos. A aplicação permite cadastro de participantes, controle de inscrições e emissão de certificados.",
        "A pesquisa analisa dados financeiros com Python para apoiar decisões gerenciais. Foram aplicadas técnicas de estatística e visualização sobre séries históricas.",
        "O projeto propõe uma plataforma de cursos online com recursos de matrícula e acompanhamento. A solução visa ampliar o acesso a conteúdos educacionais pela web.",
        "Este trabalho apresenta um sistema de recomendação de músicas baseado em preferências de escuta. A aplicação utiliza históricos e similaridade entre perfis para sugerir faixas.",
        "A pesquisa discute o uso de blockchain em sistemas de votação eletrônica. O estudo destaca aspectos de segurança, rastreabilidade e transparência no processo eleitoral.",
        "O projeto desenvolve um sistema de monitoramento ambiental com coleta automática de dados. A solução permite visualizar indicadores de temperatura, umidade e qualidade do ar.",
        "Este trabalho apresenta uma análise de dados de saúde pública com enfoque em indicadores regionais. O estudo visa contribuir para a compreensão de cenários epidemiológicos.",
        "A pesquisa propõe uma aplicação web para controle de tarefas pessoais e profissionais. A ferramenta oferece cadastro, priorização e acompanhamento de atividades.",
        "O projeto descreve um sistema de gestão de clínicas com controle de pacientes e consultas. A aplicação busca melhorar a organização dos processos administrativos da área de saúde.",
        "Este trabalho investiga aplicações de inteligência artificial na agricultura. O estudo destaca o potencial de modelos computacionais na previsão e otimização de cultivos.",
        "A pesquisa apresenta uma plataforma de compartilhamento de conhecimento em ambiente acadêmico. A proposta favorece a troca de materiais, experiências e informações entre usuários.",
        "O projeto desenvolve um sistema de detecção de fraudes com análise de padrões de comportamento. O objetivo é identificar operações suspeitas por meio de algoritmos computacionais.",
        "Este trabalho propõe uma solução de internet das coisas para casas inteligentes. O sistema integra dispositivos e permite automação e monitoramento remoto.",
        "A pesquisa apresenta um sistema de gestão de transporte com foco em rotas e controle operacional. A aplicação busca apoiar a administração de deslocamentos e veículos.",
        "O estudo realiza análise de dados climáticos para identificação de tendências ambientais. Foram utilizados registros históricos e ferramentas computacionais de processamento.",
        "Este projeto descreve um sistema de gestão de restaurantes com controle de pedidos e estoque. A aplicação foi pensada para apoiar o funcionamento diário do estabelecimento.",
        "A pesquisa propõe uma plataforma de networking profissional voltada ao meio acadêmico. A solução facilita conexões, divulgação de perfis e oportunidades de colaboração.",
        "O trabalho apresenta um sistema inteligente de controle de acesso baseado em autenticação digital. A proposta busca elevar a segurança em ambientes institucionais.",
        "Este estudo investiga técnicas de data mining aplicadas à educação. O objetivo é descobrir padrões em bases acadêmicas para apoiar ações pedagógicas.",
        "O projeto desenvolve uma plataforma de monitoramento de atividades físicas. A aplicação registra indicadores de desempenho e acompanha a evolução dos usuários.",
        "A pesquisa descreve um sistema de gestão de projetos acadêmicos para acompanhamento de etapas. A ferramenta permite registrar orientações, prazos e produção dos participantes.",
        "Este trabalho analisa o uso de inteligência artificial em diagnóstico por imagem. Foram exploradas técnicas capazes de auxiliar a interpretação de exames médicos.",
        "O projeto propõe um sistema de recomendação de cursos com base em interesses e histórico do estudante. A solução busca apoiar escolhas educacionais mais adequadas ao perfil do usuário.",
        "A pesquisa apresenta uma plataforma de avaliação de professores em ambiente universitário. O sistema organiza questionários e consolida resultados para análise institucional.",
        "Este trabalho desenvolve um sistema de gestão de TCC com controle de orientações e bancas. A aplicação centraliza informações sobre alunos, docentes e documentos do processo.",
        "O estudo investiga a aplicação de inteligência artificial em jogos digitais. O objetivo é explorar comportamentos adaptativos e estratégias automatizadas em ambientes virtuais.",
        "A pesquisa realiza análise de dados de vendas para identificação de padrões de consumo. Foram utilizados métodos estatísticos e gráficos para apoiar decisões comerciais.",
        "Este projeto apresenta um sistema de monitoramento de energia em instalações. A proposta permite acompanhar consumo e gerar relatórios para otimização de gastos.",
        "O trabalho descreve uma aplicação web para gestão de condomínios. A plataforma reúne funcionalidades de comunicação, registro financeiro e controle administrativo.",
        "A pesquisa propõe um sistema de recomendação de produtos com base em preferências de compra. O objetivo é personalizar sugestões e melhorar a experiência do consumidor.",
        "Este estudo apresenta uma plataforma de ensino de matemática com recursos interativos. A proposta combina exercícios, feedback e visualizações para apoiar o aprendizado.",
        "O projeto investiga o uso de inteligência artificial na previsão do tempo. Foram analisados dados meteorológicos com modelos capazes de estimar cenários futuros.",
        "A pesquisa desenvolve um sistema de gestão de estágios para instituições de ensino. A solução organiza cadastros, documentos e acompanhamento das atividades externas.",
        "Este trabalho propõe uma plataforma de compartilhamento de arquivos com foco em colaboração. A aplicação permite upload, organização e acesso controlado a documentos.",
        "O estudo apresenta aplicações de inteligência artificial em segurança digital. A proposta analisa o uso de algoritmos no reconhecimento de ameaças e comportamentos suspeitos.",
        "A pesquisa descreve um sistema de gestão de pesquisas acadêmicas. A ferramenta centraliza projetos, equipes, prazos e registros de produção científica.",
        "Este projeto desenvolve uma plataforma de colaboração online para equipes de trabalho. A solução reúne comunicação, tarefas e compartilhamento de materiais em um só ambiente.",
        "O trabalho investiga a análise automatizada de currículos utilizando processamento textual. O objetivo é apoiar processos seletivos por meio de categorização de perfis.",
        "A pesquisa apresenta aplicações de inteligência artificial em imagens médicas. O estudo destaca métodos computacionais para classificação e apoio à análise diagnóstica.",
        "Este trabalho propõe um sistema de monitoramento de redes computacionais. A solução permite acompanhar desempenho, falhas e tráfego em tempo real.",
        "O projeto descreve uma plataforma de ensino de idiomas com atividades e acompanhamento. A proposta busca apoiar o desenvolvimento gradual de competências linguísticas.",
        "A pesquisa apresenta um sistema de recomendação de artigos científicos. A solução considera áreas de interesse para sugerir leituras relevantes ao usuário.",
        "Este estudo investiga a aplicação de inteligência artificial em robótica. O trabalho explora modelos de decisão e controle em tarefas automatizadas.",
        "O projeto desenvolve um sistema de gestão de academias com cadastro de alunos e planos. A aplicação organiza pagamentos, frequência e acompanhamento físico.",
        "A pesquisa propõe uma plataforma de aprendizado personalizado com base em desempenho. A solução ajusta conteúdos conforme necessidades individuais de estudo.",
        "Este trabalho apresenta um sistema de controle de presença para ambientes educacionais. A ferramenta busca reduzir erros manuais e facilitar o registro de frequência.",
        "O estudo investiga o uso de inteligência artificial na previsão de demanda. O objetivo é apoiar o planejamento de estoques e serviços com base em séries temporais.",
        "A pesquisa descreve um sistema de gestão de projetos de software. A plataforma organiza etapas, tarefas, equipes e documentação do processo de desenvolvimento.",
        "Este projeto apresenta uma plataforma de compartilhamento de projetos acadêmicos. A proposta favorece a divulgação de trabalhos e a integração entre participantes.",
        "O trabalho desenvolve um sistema de recomendação de trilhas de aprendizagem. A solução sugere sequências de estudo com base em objetivos e conhecimentos prévios.",
        "A pesquisa investiga aplicações de inteligência artificial em análise de vídeos. O estudo destaca métodos para detecção de eventos e reconhecimento de padrões visuais.",
        "Este trabalho propõe um sistema de monitoramento de tráfego de rede. A aplicação permite identificar gargalos, comportamentos anômalos e indicadores de desempenho.",
        "O projeto descreve uma plataforma de ensino de ciência de dados voltada a iniciantes. A solução reúne materiais, exercícios e exemplos práticos de análise computacional.",
        "A pesquisa apresenta um sistema de gestão de laboratórios universitários. A ferramenta permite controlar reservas, equipamentos e histórico de utilização.",
        "Este estudo investiga técnicas de inteligência artificial aplicadas à análise de texto. O objetivo é automatizar classificações e extração de informações relevantes.",
        "O projeto propõe um sistema de recomendação de eventos acadêmicos. A aplicação considera interesses do usuário para indicar palestras, cursos e encontros científicos.",
        "A pesquisa apresenta uma plataforma de avaliação online de cursos. O sistema coleta opiniões e organiza relatórios para acompanhamento da qualidade do ensino.",
        "Este trabalho descreve um sistema de gestão de documentos com armazenamento digital. A solução facilita organização, busca e controle de versões de arquivos.",
        "O estudo investiga o uso de inteligência artificial em análise de logs computacionais. A proposta busca detectar falhas e padrões relevantes em grandes volumes de registros.",
        "A pesquisa desenvolve um sistema de monitoramento de equipamentos para manutenção preventiva. A solução acompanha indicadores de funcionamento e alerta sobre anomalias.",
        "Este projeto apresenta uma plataforma de ensino de programação web com recursos interativos. A proposta busca apoiar estudantes por meio de exemplos e atividades práticas.",
        "O trabalho propõe um sistema de recomendação de conteúdo educacional. A aplicação seleciona materiais compatíveis com objetivos e histórico de aprendizagem do usuário.",
        "A pesquisa investiga o uso de inteligência artificial na previsão de vendas. O estudo considera séries históricas e variáveis contextuais para estimar cenários futuros.",
        "Este trabalho descreve um sistema de gestão de pesquisa científica em ambiente universitário. A ferramenta organiza projetos, cronogramas, participantes e resultados.",
        "O projeto apresenta uma plataforma de compartilhamento de dados científicos. A proposta busca favorecer acesso, organização e reutilização de informações de pesquisa.",
        "A pesquisa realiza análise de redes sociais para identificação de padrões de interação. O estudo utiliza métricas computacionais para examinar conexões entre perfis.",
        "Este trabalho investiga a aplicação de inteligência artificial em diagnóstico de falhas. O objetivo é detectar comportamentos anormais em sistemas e equipamentos.",
        "O projeto desenvolve um sistema de gestão de bolsas acadêmicas com controle de editais e beneficiários. A aplicação organiza processos e facilita consultas administrativas.",
        "A pesquisa apresenta uma plataforma de ensino de inteligência artificial para estudantes iniciantes. A solução reúne conceitos teóricos, exemplos e exercícios orientados.",
        "Este estudo propõe um sistema de recomendação de leituras acadêmicas. A aplicação considera temas de interesse para sugerir textos e referências relevantes.",
        "O trabalho investiga o uso de inteligência artificial em análise de comportamento. A proposta busca reconhecer padrões em dados gerados por interações dos usuários.",
        "A pesquisa descreve um sistema de gestão de publicações científicas. A ferramenta organiza artigos, autores, periódicos e informações relacionadas à produção acadêmica.",
        "Este projeto apresenta uma plataforma de ensino de computação com materiais introdutórios. A solução foi elaborada para apoiar estudantes em disciplinas iniciais.",
        "O estudo propõe um sistema de recomendação de projetos acadêmicos com base em perfil e interesse. A aplicação busca aproximar estudantes de temas compatíveis com sua formação.",
        "A pesquisa investiga aplicações de inteligência artificial em educação personalizada. O trabalho destaca estratégias computacionais para adaptar conteúdos ao ritmo do aluno.",
    ]

    palavras_chave = [
        "inteligência artificial, aprendizado de máquina, análise de dados",
        "sistemas web, django, desenvolvimento backend",
        "ciência de dados, python, visualização",
        "mineração de dados, educação, análise",
        "engenharia de software, arquitetura, sistemas",
        "redes neurais, deep learning, imagens",
        "internet das coisas, sensores, monitoramento",
        "segurança digital, criptografia, autenticação",
        "processamento de linguagem natural, texto, classificação",
        "big data, análise, armazenamento",
        "algoritmos, estrutura de dados, programação",
        "machine learning, previsão, modelos",
        "banco de dados, sql, gerenciamento",
        "análise de dados, estatística, python",
        "desenvolvimento web, frontend, javascript",
        "backend, api, integração",
        "visualização de dados, dashboards, gráficos",
        "robótica, automação, inteligência artificial",
        "computação em nuvem, escalabilidade, serviços",
        "sistemas distribuídos, redes, processamento",
        "aprendizado supervisionado, classificação, modelos",
        "aprendizado não supervisionado, clustering, análise",
        "engenharia de requisitos, software, análise",
        "testes de software, qualidade, automação",
        "devops, integração contínua, deploy",
        "arquitetura de software, padrões, projeto",
        "frameworks web, django, flask",
        "python, programação, algoritmos",
        "educação digital, plataformas, ensino",
        "sistemas de recomendação, filtragem, personalização",
        "redes sociais, análise, dados",
        "segurança da informação, autenticação, controle",
        "aplicações móveis, desenvolvimento, interfaces",
        "usabilidade, experiência do usuário, design",
        "design de interface, ux, ui",
        "banco de dados relacional, modelagem, consultas",
        "banco de dados nosql, escalabilidade, dados",
        "análise exploratória, dados, estatística",
        "visualização interativa, dashboards, análise",
        "engenharia de dados, pipelines, processamento",
        "iot, automação residencial, sensores",
        "sistemas inteligentes, decisão, aprendizado",
        "aprendizado profundo, redes neurais, visão computacional",
        "reconhecimento de imagens, visão computacional, modelos",
        "processamento de texto, linguagem natural, análise",
        "chatbots, atendimento automatizado, linguagem natural",
        "educação online, plataformas, aprendizagem",
        "sistemas educacionais, gestão acadêmica, software",
        "gestão de projetos, planejamento, equipes",
        "monitoramento de redes, desempenho, tráfego",
        "segurança de redes, proteção, monitoramento",
        "análise de logs, segurança, sistemas",
        "detecção de fraudes, dados, aprendizado",
        "previsão de vendas, modelos, dados",
        "previsão de demanda, análise, séries temporais",
        "séries temporais, previsão, dados",
        "análise financeira, dados, indicadores",
        "análise climática, dados, previsão",
        "análise de mobilidade, transporte, dados",
        "mobilidade urbana, análise, planejamento",
        "sistemas de transporte, otimização, rotas",
        "gestão de energia, monitoramento, consumo",
        "sistemas embarcados, sensores, controle",
        "controle de acesso, segurança, autenticação",
        "reconhecimento facial, visão computacional, segurança",
        "identificação biométrica, autenticação, segurança",
        "gestão hospitalar, sistemas, saúde",
        "dados médicos, análise, inteligência artificial",
        "diagnóstico assistido, imagens médicas, inteligência artificial",
        "análise de comportamento, dados, padrões",
        "redes complexas, análise, grafos",
        "teoria dos grafos, algoritmos, redes",
        "processamento paralelo, desempenho, computação",
        "computação de alto desempenho, paralelismo, algoritmos",
        "otimização, algoritmos, modelos",
        "simulação computacional, modelos, sistemas",
        "modelagem matemática, análise, sistemas",
        "engenharia computacional, sistemas, análise",
        "gestão de conhecimento, informação, sistemas",
        "compartilhamento de dados, plataformas, colaboração",
        "colaboração online, plataformas, equipes",
        "sistemas colaborativos, comunicação, plataformas",
        "gestão documental, arquivos digitais, sistemas",
        "documentos digitais, organização, informação",
        "bibliotecas digitais, informação, acesso",
        "publicações científicas, gestão, dados",
        "repositórios acadêmicos, pesquisa, dados",
        "indicadores científicos, análise, produção",
        "avaliação acadêmica, métricas, desempenho",
        "plataformas educacionais, ensino, tecnologia",
        "aprendizagem adaptativa, educação, tecnologia",
        "ensino de programação, educação, software",
        "didática de computação, ensino, aprendizagem",
        "educação em computação, métodos, ensino",
        "cursos online, plataformas, aprendizagem",
        "conteúdo educacional, recomendação, aprendizagem",
        "recursos educacionais digitais, ensino, tecnologia",
        "aprendizagem personalizada, dados, educação",
        "análise educacional, dados, aprendizagem",
        "tecnologia educacional, inovação, ensino"
        ]
    
    professores_objs = []
    for nome in nomes_professores:
        obj = Professor.objects.create(nome=nome, departamento=random.choice(depto_objs))
        professores_objs.append(obj)
    
    status_choices = ['0', '1', '2', '3']
    tipo_choices = ['MONOGRAFIA', 'RELATORIO_ESTAGIO', 'RELATORIO_TECNICO', 'ARTIGO']
    idioma_choices = ['PT', 'EN']
    semestre_choices = ['2020/1', '2020/2', '2021/1', '2021/2', '2022/1', '2022/2', '2023/1', '2023/2', 
                        '2024/1', '2024/2', '2025/1', '2025/2', '2026/1']

    for i in range(len(nomes_alunos)):
        aluno = Aluno.objects.create(nome=nomes_alunos[i], matricula=f"2023{1000 + i}", curso=random.choice(curso_objs))
        
        orientador = random.choice(professores_objs)
        # 50% de chance de ter um coorientador
        coorientador = random.choice([p for p in professores_objs if p != orientador]) if random.random() > 0.5 else None

        TCC.objects.create(
            titulo=titulos_tcc[i],
            resumo=resumos[i],
            palavras_chave=palavras_chave[i],
            tipo=random.choice(tipo_choices),
            idioma=random.choice(idioma_choices),
            aluno=aluno,
            orientador=orientador,
            coorientador=coorientador,
            presidente=orientador,
            primeiro_membro=random.choice(professores_objs),
            segundo_membro=random.choice(professores_objs),
            semestre_letivo_defesa=random.choice(semestre_choices),
            status=random.choice(status_choices)
        )

    print("População concluída com sucesso!")

if __name__ == '__main__':
    populate()
    
