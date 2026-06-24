# TCC App — Frontend Mobile React Native

App mobile para gerenciamento de TCCs, consumindo a API REST Django do projeto `ufla-prog-web/projeto-gestao-tccs`.

## Funcionalidades

- **Dashboard** com estatísticas e gráficos de barras (por status e orientador)
- **Listagem de TCCs** com busca por título/aluno
- **Cadastro e edição de TCC** com upload de PDF
- **Alteração de status** (Em Elaboração → Enviado → Aprovado/Reprovado)
- **Listagem de Alunos, Professores, Cursos, Departamentos e Unidades Acadêmicas**

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI: `npm install -g expo-cli`
- App **Expo Go** no celular (iOS ou Android)

## Instalação

```bash
cd tcc-app
npm install
```

## Configuração da API

Edite `src/services/api.js` e altere `BASE_URL` conforme o endereço do seu backend:

```js
// Para emulador Android (acessa localhost da máquina):
const BASE_URL = 'http://10.0.2.2:8000/api';

// Para dispositivo físico (use o IP da sua máquina na rede):
const BASE_URL = 'http://192.168.x.x:8000/api';

// Para emulador iOS:
const BASE_URL = 'http://127.0.0.1:8000/api';
```

## Rodar o app

```bash
npm start
# Ou:
npx expo start
```

Escaneie o QR Code com o Expo Go no celular.

## Upload de PDF

O projeto usa `FormData` nativo para upload. Para ativar o seletor de arquivos real no celular, instale:

```bash
npx expo install expo-document-picker
```

Então substitua a função `simularUpload` em `CadastrarTCCScreen.js` por:

```js
import * as DocumentPicker from 'expo-document-picker';

async function selecionarArquivo() {
  const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
  if (!result.canceled) {
    const file = result.assets[0];
    setArquivo({ name: file.name, uri: file.uri, type: 'application/pdf' });
  }
}
```

## Estrutura do projeto

```
tcc-app/
├── App.js
├── src/
│   ├── services/
│   │   ├── api.js          # Todas as chamadas à API REST
│   │   └── status.js       # Mapeamento de status
│   ├── navigation/
│   │   └── AppNavigator.js # Tabs + Stacks de navegação
│   └── screens/
│       ├── DashboardScreen.js      # Gráficos e estatísticas
│       ├── TccsScreen.js           # Lista + busca de TCCs
│       ├── DetalhesTCCScreen.js    # Detalhes + troca de status
│       ├── CadastrarTCCScreen.js   # Formulário criar/editar
│       └── ListaGenericaScreen.js  # Alunos/Profs/Cursos etc.
```

## Tecnologias

- React Native + Expo
- React Navigation (Bottom Tabs + Native Stack)
- Fetch API nativa (sem axios)
- StyleSheet nativo (sem bibliotecas de UI)
