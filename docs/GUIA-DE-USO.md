# Guia de uso

Cenários passo a passo para usar o MeOwganiza com segurança.

## Antes de começar

1. Tenha o Python 3.10+ instalado.
2. Clone o repositório ou instale o pacote (`python -m pip install .`).
3. Confirme que a CLI responde:

```bash
python meowganiza.py --version
python meowganiza.py --help
```

> Todos os exemplos usam `python meowganiza.py`. Se você instalou o pacote, pode
> trocar por `meowganiza`.

---

## Cenário 1 — Primeira organização com segurança

### Passo 1: criar um sandbox

```bash
python meowganiza.py demo
```

Isso cria `sandbox_teste/` com documentos, imagens, vídeos, arquivos antigos,
um arquivo oculto e uma colisão proposital.

### Passo 2: simular

```bash
python meowganiza.py organize sandbox_teste
```

Nada é alterado. Observe:

- arquivos analisados;
- operações planejadas;
- arquivos ignorados e o motivo;
- prévia origem → destino.

### Passo 3: executar

```bash
python meowganiza.py organize sandbox_teste --apply --report
```

A CLI pede confirmação. Use `--yes` para automação.

### Passo 4: conferir o relatório

O caminho aparece no final da execução. Abra o Markdown e verifique a tabela de
operações.

### Passo 5: desfazer

```bash
python meowganiza.py undo --latest
```

Os arquivos voltam para as posições originais.

---

## Cenário 2 — Organizar Downloads por categoria

```bash
# Simulação
python meowganiza.py organize ~/Downloads

# Execução com relatório automático
python meowganiza.py organize ~/Downloads --apply --report
```

Se houver muitos arquivos, o plano pode levar alguns segundos. O MeOwganiza não
entra em subpastas por padrão.

Para incluir subpastas:

```bash
python meowganiza.py organize ~/Downloads --recursive --apply
```

---

## Cenário 3 — Arquivar somente arquivos antigos

```bash
python meowganiza.py organize ~/Documentos --older-than 365 --archive-old 365 --apply
```

O resultado é:

```text
Documentos/
└── Arquivo/
    ├── 2024/
    └── 2025/
```

> Use `--archive-old` para mover os antigos e organizar o restante, ou combine
> com `--older-than` para afetar **somente** os antigos.

---

## Cenário 4 — Renomear fotos em massa

```bash
python meowganiza.py organize ~/Fotos --rename "viagem-{seq:03d}{ext}" --rename-only
```

Prévia:

```text
[MOVER   ] IMG_001.jpg -> IMG_001.jpg   (se já estiver no lugar, é ignorado)
```

Para aplicar:

```bash
python meowganiza.py organize ~/Fotos --rename "viagem-{seq:03d}{ext}" --rename-only --apply
```

Tokens disponíveis:

| Token | Significado | Exemplo |
| --- | --- | --- |
| `{name}` / `{stem}` | Nome sem extensão | `relatorio` |
| `{ext}` | Extensão com ponto | `.pdf` |
| `{extensao}` | Extensão sem ponto | `pdf` |
| `{seq}` | Sequência | `1`, `2`, `3` |
| `{seq:03d}` | Sequência formatada | `001` |
| `{date}` / `{data}` | Data de modificação | `2026-11-02` |
| `{categoria}` | Categoria detectada | `Imagens` |

---

## Cenário 5 — Filtrar por tipo e tamanho

```bash
# Somente PDFs
python meowganiza.py organize . --pattern "*.pdf"

# Imagens entre 1 MB e 10 MB
python meowganiza.py organize ./midias --category Imagens --min-size 1MB --max-size 10MB

# Arquivos grandes, com mais de 30 dias
python meowganiza.py organize . --min-size 100MB --older-than 30
```

---

## Cenário 6 — Relatórios para planilha

```bash
python meowganiza.py organize ./dados --apply --report relatorio.csv
```

O CSV usa `;` como separador e UTF-8 com BOM, para abrir corretamente no Excel
em português.

Para JSON:

```bash
python meowganiza.py organize ./dados --apply --report relatorio.json
```

Para integrar com outro programa:

```bash
python meowganiza.py organize ./dados --json > saida.json
```

---

## Cenário 7 — Automação diária

### Linux/macOS

```bash
chmod +x scripts/*.sh

# Testa o ambiente
./scripts/test_ambiente.sh

# Simula
./scripts/automacao.sh --target ~/Downloads

# Executa
./scripts/automacao.sh --target ~/Downloads --apply --report

# Agenda toda segunda-feira às 09:00 (use --install para instalar no crontab)
./scripts/agendar_cron.sh ~/Downloads --install
```

### Windows

```powershell
.\scripts\test_ambiente.ps1
.\scripts\automacao.ps1 -Target "$HOME\Downloads"
.\scripts\automacao.ps1 -Target "$HOME\Downloads" -Apply -Report
.\scripts\agendar_tarefa.ps1 -Target "$HOME\Downloads" -Time "09:00" -Register
```

---

## Configuração personalizada

Crie um arquivo:

```bash
python meowganiza.py config --init ./minha-config.json
```

Edite as categorias e use:

```bash
python meowganiza.py organize . --config ./minha-config.json
```

Ou defina permanentemente:

```bash
export MEOWGANIZA_CONFIG=~/minha-config.json     # Linux/macOS
$env:MEOWGANIZA_CONFIG = "$HOME\minha-config.json"  # PowerShell
```

---

## Perguntas frequentes

### O MeOwganiza apaga arquivos?

Não. Ele move, renomeia e arquiva. Arquivos ignorados permanecem onde estão.

### O que acontece se o destino já existir?

Um nome único é gerado: `foto.jpg` → `foto (1).jpg`. Nada é sobrescrito.

### Posso desfazer qualquer execução?

Sim, desde que o journal ainda exista e os arquivos não tenham sido movidos
manualmente. Use `undo --list` para ver as execuções disponíveis.

### O que é o diretório de estado?

É onde ficam journal, logs e relatórios. No Linux/macOS:
`~/.local/share/meowganiza`; no Windows: `%LOCALAPPDATA%\MeOwganiza`.

### Links simbólicos são seguidos?

Não. Por segurança, links são ignorados pelo planejador e recusados pelo
executor.

### Posso organizar a raiz do sistema?

Não. O MeOwganiza recusa explicitamente `/` e `C:\`.

### Como limpar o estado?

Apague o diretório de estado. Isso remove journals e logs, mas **não** desfaz
execuções já realizadas.

```bash
rm -rf ~/.local/share/meowganiza          # Linux/macOS
Remove-Item -Recurse "$env:LOCALAPPDATA\MeOwganiza"  # Windows
```

---

## Solução de problemas

| Problema | Causa provável | Solução |
| --- | --- | --- |
| `python` não encontrado | Python fora do PATH | Use `py -3` ou caminho completo |
| `Permission denied` | Sem permissão na pasta | Ajuste permissões ou escolha outra pasta |
| `JSON inválido` | Configuração malformada | Valide com `python meowganiza.py config --show` |
| Nada é organizado | Filtros muito restritivos | Remova `--pattern`, `--older-than` etc. |
| Undo falha | Origem ocupada ou destino ausente | Verifique o journal e restaure manualmente |
| Execução lenta | Muitos arquivos ou rede | Use uma pasta local e execute por partes |
