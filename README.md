# TCC App

Aplicação desenvolvida como trabalho da disciplina de Programação Web da UFLA.

O backend Django REST Framework já havia sido desenvolvido pelos professores e está disponível no repositório [ufla-prog-web/projeto-gestao-tccs](https://github.com/ufla-prog-web/projeto-gestao-tccs). O trabalho deste repositório foi criar um frontend em React Native/Expo para consumir essa API, listar dados, exibir estatísticas e permitir a interação com os TCCs.

## Estrutura

- `back/projeto-gestao-tccs`: backend Django com API REST e banco SQLite.
- `front`: aplicativo React Native com Expo.
- `docker-compose.yml`: sobe backend, frontend e banco SQLite persistido em volume.

O backend continua usando SQLite. O banco fica no volume Docker `sqlite_data`, e os arquivos enviados ficam no volume `backend_media`.

## Pré-requisitos

- Docker e Docker Compose.
- Para testar no celular: aplicativo Expo Go instalado.
  - Android: Play Store.
  - iOS: App Store.

Não é necessário fazer login em uma conta Expo para testar localmente com QR Code.

## Rodar Com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

O backend fica disponível em:

```text
http://localhost:8001/api/
```

O frontend sobe pelo Expo/Metro. No terminal, procure uma linha parecida com:

```text
Expo/Metro: exp://192.168.1.156:8082
Backend API: http://192.168.1.156:8001/api
```

Abra o Expo Go no celular e escaneie o QR Code exibido no terminal.

## Testar No Celular

O celular precisa conseguir acessar o computador pela rede. Em geral, basta que ambos estejam no mesmo Wi-Fi.

Se o IP automático não funcionar, descubra o IP do computador:

```bash
hostname -I
```

Depois rode informando o IP manualmente:

```bash
API_HOST=192.168.1.156 EXPO_HOST_IP=192.168.1.156 docker compose up --build
```

Troque `192.168.1.156` pelo IP real do seu computador.

O QR Code precisa apontar para o IP do computador, por exemplo:

```text
exp://192.168.1.156:8082
```

Se aparecer `localhost`, `127.0.0.1` ou `172.x.x.x`, o celular provavelmente não vai conseguir abrir.

## Modo Túnel Do Expo

Se o Expo Go mostrar "Something went wrong" ou ficar carregando para sempre, use o modo túnel:

```bash
EXPO_TUNNEL=1 docker compose up --build
```

Esse modo cria um endereço externo temporário do Expo, parecido com:

```text
exp://alguma-coisa.exp.direct
```

Isso costuma resolver problemas de Wi-Fi, roteador e firewall para carregar o app no Expo Go.

Sobre segurança: o túnel não expõe seu computador inteiro. Ele expõe temporariamente o servidor de desenvolvimento do Expo/Metro enquanto o comando estiver rodando. Ainda assim, é um recurso de desenvolvimento: use em rede confiável, não envie dados sensíveis e pare com `Ctrl+C` ou `docker compose down` quando terminar.

Importante: o túnel ajuda o celular a carregar o app. A API Django ainda roda no seu computador. Para confirmar que o celular consegue acessar a API, abra no navegador do celular:

```text
http://IP_DO_COMPUTADOR:8001/api/
```

Exemplo:

```text
http://192.168.1.156:8001/api/
```

## Testar No PC Pelo Navegador

Mesmo sendo React Native, o Expo também permite rodar uma versão web para testes rápidos:

```bash
FRONTEND_COMMAND="npm run web:docker" docker compose up --build
```

Abra:

```text
http://localhost:8082
```

## Parar Ou Resetar

Para parar os containers:

```bash
docker compose down
```

Para apagar também o banco SQLite e uploads persistidos:

```bash
docker compose down -v
```

## Se Der Erro De Porta Ocupada

O projeto usa as portas `8001` para o backend e `8082` para o Expo/Metro. Se alguma delas estiver ocupada:

```bash
BACKEND_PORT=8010 FRONTEND_PORT=8090 docker compose up --build
```

Nesse caso:

- API: `http://localhost:8010/api/`
- Expo/Metro ou Web: `http://localhost:8090`

Para descobrir quem está usando uma porta:

```bash
ss -ltnp
```

## Sobre O Expo

Expo é uma plataforma em cima do React Native. Ela facilita o desenvolvimento mobile porque fornece:

- Metro Bundler, o servidor que entrega o JavaScript do app em desenvolvimento.
- Expo Go, aplicativo de celular que carrega o app pelo QR Code.
- SDK com bibliotecas nativas prontas.
- Ferramentas para build de APK/IPA quando o app for para produção.

Neste projeto, o Docker sobe o Metro Bundler. O app roda no celular dentro do Expo Go.

## Versão Do Expo

O frontend está atualizado para Expo SDK 54:

```json
"expo": "~54.0.0"
```

O SDK 54 usa React Native `0.81` e React `19.1.0`, conforme a referência oficial da Expo: [Expo SDK reference](https://docs.expo.dev/versions/v54.0.0/).

## Rodar Sem Docker

Backend:

```bash
cd back/projeto-gestao-tccs
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python load.py
python manage.py runserver 0.0.0.0:8000
```

Frontend:

```bash
cd front
npm install
npm start
```

Para Expo Go no celular sem Docker:

```bash
EXPO_PUBLIC_API_URL=http://SEU_IP_NA_REDE:8000/api npm start
```

## Observações Do Frontend

As telas de dashboard e listagens devem consumir a API normalmente. O cadastro/edição de TCC ainda precisa de revisão funcional, porque o formulário atual não envia todos os campos obrigatórios do model Django, como `tipo`, `idioma` e membros da banca. O upload de PDF também está simulado.
