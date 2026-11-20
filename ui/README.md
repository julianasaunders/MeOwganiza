# Interface do MeOwganiza (`ui/`)

Esta pasta contém a interface web local usada tanto pelo comando
`python meowganiza.py web` quanto pelo aplicativo nativo (`native`).

| Arquivo | Função |
| --- | --- |
| `app.html` | Interface principal, com HTML e CSS autocontidos. Mantém o mesmo visual da demonstração pública (`index.html`, na raiz). |
| `app.js` | Adaptador que liga a interface à API local (`/api/scan`, `/api/apply`, `/api/undo`) e ao seletor de pastas nativo. |
| `favicon.svg` | Ícone exibido como favicon pelo `app.html`. |
| `logo-gato.svg` | Logo exibida na barra de ferramentas da interface (`app.js`). |

O servidor em `src/meowganiza/web.py` serve esta pasta em `127.0.0.1:8765`
e redireciona `/` para `/app.html`. O aplicativo nativo
(`src/meowganiza/native.py`) abre a mesma página em uma janela pywebview.

Nenhum recurso externo é necessário: a interface funciona offline e não
envia arquivos para servidores.
