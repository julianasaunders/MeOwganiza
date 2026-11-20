# Configuração, dados e privacidade

[← Voltar ao README principal](../README.md)

## Como a configuração é encontrada

A configuração é procurada nesta ordem:

1. `--config CAMINHO`
2. `MEOWGANIZA_CONFIG`
3. `<MEOWGANIZA_HOME>/config.json`
4. `config/meowganiza.example.json`

| Variável | Finalidade |
| --- | --- |
| `MEOWGANIZA_HOME` | Define o diretório de estado, logs e journal |
| `MEOWGANIZA_CONFIG` | Define o arquivo JSON de configuração |
| `MEOWGANIZA_TARGET` | Define a pasta-alvo padrão |

O diretório de estado segue o padrão XDG em Linux/macOS e `%LOCALAPPDATA%` no Windows. `MEOWGANIZA_HOME` permite defini-lo manualmente.

Exemplo completo: [`config/meowganiza.example.json`](../config/meowganiza.example.json).

## Dados e privacidade

O processamento é **local**: os arquivos analisados permanecem no computador. O estado, o journal e os relatórios são gravados localmente. A demonstração hospedada no GitHub Pages apresenta o projeto e não acessa pastas do seu computador.

A aplicação não faz chamadas de rede. Consulte [`SECURITY.md`](../SECURITY.md) para garantias, limitações conhecidas e boas práticas.

## Próximos passos

- [Instalação e execução](INSTALACAO.md) — como rodar o projeto
- [Guia de uso](GUIA-DE-USO.md) — configuração personalizada na prática
- [Arquitetura](ARQUITETURA.md) — onde a configuração entra no fluxo de dados
