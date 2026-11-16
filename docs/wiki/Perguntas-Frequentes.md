# Perguntas frequentes

## O MeOwganiza apaga arquivos?

Não. Ele move, renomeia e arquiva. Arquivos ignorados permanecem onde estão.

## O que acontece se o destino já existir?

Um nome único é gerado: `foto.jpg` → `foto (1).jpg`. Nada é sobrescrito.

## Como desfazer uma execução?

```bash
python meowganiza.py undo --list
python meowganiza.py undo --latest
```

## Posso desfazer qualquer execução?

Desde que o journal exista e os arquivos não tenham sido movidos manualmente.

## Onde ficam journal, logs e relatórios?

| Sistema | Caminho |
| --- | --- |
| Linux/macOS | `~/.local/share/meowganiza` |
| Windows | `%LOCALAPPDATA%\MeOwganiza` |
| Qualquer | `MEOWGANIZA_HOME` |

## Links simbólicos são seguidos?

Não. São ignorados pelo planejador e recusados pelo executor.

## Posso organizar a raiz do sistema?

Não. O MeOwganiza recusa `/` e `C:\`.

## Preciso instalar dependências?

Não. Apenas Python 3.10+ e a biblioteca padrão.

## Como rodar os testes?

```bash
python -m unittest discover -s tests -v
```

## Como contribuir?

Leia o
[CONTRIBUTING.md](https://github.com/julianasaunders/MeOwganiza/blob/main/CONTRIBUTING.md).

Voltar para [Home](Home).
