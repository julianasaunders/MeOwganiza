# 🐱 MeOwganiza 2.0

> **Organizador seguro de arquivos** — projeto integrador da disciplina de **Sistemas Operacionais**.

[![CI](https://github.com/julianasaunders/MeOwganiza/actions/workflows/ci.yml/badge.svg)](https://github.com/julianasaunders/MeOwganiza/actions/workflows/ci.yml)
[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Licença MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-green.svg)](LICENSE)

---

## 💡 Motivação

Pastas com muitos arquivos podem ser difíceis de navegar e organizar manualmente. Automatizar essa tarefa sem uma prévia também pode causar movimentações inesperadas ou perda de dados.

Por isso o MeOwganiza separa **planejamento** e **execução**: primeiro mostra o que pretende fazer; a pessoa revisa e confirma antes de qualquer alteração. Além de útil no dia a dia, o projeto serve para demonstrar conceitos de **Sistemas Operacionais** aplicados a uma tarefa cotidiana.

## 🎬 Demonstração

[![Demonstração do MeOwganiza](docs/images/demo.gif)](https://raw.githubusercontent.com/julianasaunders/MeOwganiza/main/docs/images/demo.mp4)

**🌐 [Demonstração online](https://julianasaunders.github.io/MeOwganiza/)** · **📥 [Download](https://julianasaunders.github.io/MeOwganiza/download.html)** · **📖 [Guia de uso](docs/GUIA-DE-USO.md)**

> A demonstração online é ilustrativa: ela não acessa pastas do seu computador. Para organizar arquivos reais, use o aplicativo ou a CLI local.

## ✨ O que faz

<table width="750">
  <thead>
    <tr><th width="230" align="center">✨ Recurso</th><th width="520">📋 O que faz</th></tr>
  </thead>
  <tbody>
    <tr><td width="230" align="center"><strong>Organização por categoria</strong></td><td width="520">Agrupa arquivos por extensão, usando categorias configuráveis</td></tr>
    <tr><td width="230" align="center"><strong>Simulação e prévia</strong></td><td width="520">Planeja as operações sem alterar arquivos</td></tr>
    <tr><td width="230" align="center"><strong>Renomeação em massa</strong></td><td width="520">Usa padrões com <code>{name}</code>, <code>{ext}</code>, <code>{seq}</code> e <code>{date}</code></td></tr>
    <tr><td width="230" align="center"><strong>Arquivamento</strong></td><td width="520">Move arquivos antigos para <code>Arquivo/AAAA/</code> quando solicitado</td></tr>
    <tr><td width="230" align="center"><strong>Relatórios</strong></td><td width="520">Gera relatórios em Markdown, CSV ou JSON</td></tr>
    <tr><td width="230" align="center"><strong>Desfazer</strong></td><td width="520">Restaura uma execução anterior usando o journal</td></tr>
    <tr><td width="230" align="center"><strong>Diagnóstico</strong></td><td width="520">Mostra CPU, memória, disco, processo e permissões</td></tr>
  </tbody>
</table>

👉 [Ver todos os recursos, requisitos e glossário](docs/RECURSOS.md)

## 🚀 Instalação rápida

### Aplicativo (recomendado)

Baixe o pacote do seu sistema na [página de downloads](https://julianasaunders.github.io/MeOwganiza/download.html):

<table width="750">
  <thead>
    <tr><th width="230" align="center">Sistema</th><th width="260">Arquivo</th><th width="260">Como abrir</th></tr>
  </thead>
  <tbody>
    <tr><td width="230" align="center"><strong>Windows 10/11</strong></td><td width="260"><code>MeOwganiza.exe</code></td><td width="260">Baixe e abra. Não precisa instalar Python.</td></tr>
    <tr><td width="230" align="center"><strong>Linux x86_64</strong></td><td width="260"><code>MeOwganiza-linux-x86_64.tar.gz</code></td><td width="260">Extraia, <code>chmod +x MeOwganiza</code> e execute <code>./MeOwganiza</code>.</td></tr>
    <tr><td width="230" align="center"><strong>macOS 11+</strong></td><td width="260"><code>MeOwganiza-macos-arm64.dmg</code></td><td width="260">Abra o <code>.dmg</code> e arraste para Aplicativos.</td></tr>
  </tbody>
</table>

### Pelo código-fonte

```bash
git clone https://github.com/julianasaunders/MeOwganiza.git
cd MeOwganiza
python -m venv .venv
python -m pip install -e .
```

```bash
python meowganiza.py demo sandbox_teste      # cria pasta de demonstração
python meowganiza.py organize sandbox_teste  # simula — não altera arquivos
python meowganiza.py organize sandbox_teste --apply  # aplica após revisar
```

👉 [Instalação completa, interface nativa, comandos e automação](docs/INSTALACAO.md)

## 🔒 Segurança em primeiro lugar

- `organize` apenas **simula** por padrão; use `--apply` para executar.
- Operações reais pedem confirmação, exceto com `--yes`.
- Arquivos **não são sobrescritos nem excluídos**; colisões recebem um nome único.
- Tudo é registrado em journal e pode ser desfeito.

## 🧱 Stack

<table width="750">
  <thead>
    <tr><th width="230" align="center">🔧 Tecnologia</th><th width="520">📝 Uso</th></tr>
  </thead>
  <tbody>
    <tr><td width="230" align="center"><strong>Python 3.10+</strong></td><td width="520">CLI, planejamento, execução, relatórios e diagnóstico</td></tr>
    <tr><td width="230" align="center"><strong>HTML, CSS e JavaScript</strong></td><td width="520">Interface web e conteúdo da interface gráfica</td></tr>
    <tr><td width="230" align="center"><strong>pywebview</strong></td><td width="520">Dependência opcional da janela nativa</td></tr>
    <tr><td width="230" align="center"><strong><code>unittest</code></strong></td><td width="520">Testes automatizados</td></tr>
    <tr><td width="230" align="center"><strong>GitHub Actions / Pages</strong></td><td width="520">Integração contínua e demonstração do projeto</td></tr>
  </tbody>
</table>

## 📚 Documentação

<table width="750">
  <thead>
    <tr><th width="230" align="center">📄 Documento</th><th width="520">📋 Conteúdo</th></tr>
  </thead>
  <tbody>
    <tr><td width="230" align="center"><a href="docs/Projeto%20MeOwganiza_2.0.pdf">Documentação do projeto (PDF)</a></td><td width="520">Versão escrita do projeto integrador (FATEC Itapetininga)</td></tr>
    <tr><td width="230" align="center"><a href="docs/RECURSOS.md">Recursos, requisitos e glossário</a></td><td width="520">Funcionalidades completas, RF/RNF e termos</td></tr>
    <tr><td width="230" align="center"><a href="docs/INSTALACAO.md">Instalação e execução</a></td><td width="520">Binários, código-fonte, interface nativa, comandos e agendamento</td></tr>
    <tr><td width="230" align="center"><a href="docs/CONFIGURACAO.md">Configuração e privacidade</a></td><td width="520">Arquivos de config, variáveis de ambiente e dados locais</td></tr>
    <tr><td width="230" align="center"><a href="docs/DEMONSTRACAO.md">Demonstração e deploy</a></td><td width="520">Vídeo, galeria passo a passo e página pública</td></tr>
    <tr><td width="230" align="center"><a href="docs/GUIA-DE-USO.md">Guia de uso</a></td><td width="520">Cenários práticos e perguntas frequentes</td></tr>
    <tr><td width="230" align="center"><a href="docs/ARQUITETURA.md">Arquitetura</a></td><td width="520">Módulos, fluxo de dados e decisões de projeto</td></tr>
    <tr><td width="230" align="center"><a href="docs/CONCEITOS-SO.md">Conceitos de Sistemas Operacionais</a></td><td width="520">Teoria conectada ao código</td></tr>
    <tr><td width="230" align="center"><a href="docs/TESTES.md">Testes</a></td><td width="520">Estratégia e execução da suíte</td></tr>
    <tr><td width="230" align="center"><a href="docs/PLANEJAMENTO.md">Planejamento</a></td><td width="520">Escopo, backlog e divisão de tarefas</td></tr>
    <tr><td width="230" align="center"><a href="docs/RELEASE.md">Release</a></td><td width="520">Checklist de publicação</td></tr>
    <tr><td width="230" align="center"><a href="CONTRIBUTING.md">Contribuindo</a> · <a href="CODE_OF_CONDUCT.md">Código de conduta</a> · <a href="SECURITY.md">Segurança</a></td><td width="520">Como participar e diretrizes</td></tr>
    <tr><td width="230" align="center"><a href="https://github.com/julianasaunders/MeOwganiza/wiki">Wiki do projeto</a></td><td width="520">Instalação, arquitetura e FAQ</td></tr>
  </tbody>
</table>

## 👥 Equipe e licença

- **Juliana Saunders** — [@julianasaunders](https://github.com/julianasaunders)
- **Jaquelline Feitoza** — [@jaquellinef](https://github.com/jaquellinef)

Distribuído sob a licença **MIT**. Consulte [`LICENSE`](LICENSE).
