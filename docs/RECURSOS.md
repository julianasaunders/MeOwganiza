# Funcionalidades, requisitos e glossário

[← Voltar ao README principal](../README.md)

Este documento reúne o detalhamento que ficou de fora do README principal: escopo completo, requisitos e termos usados no projeto.

## Escopo e funcionalidades

<table width="750">
  <thead>
    <tr><th width="230" align="center">✨ Recurso</th><th width="520">📋 O que faz</th></tr>
  </thead>
  <tbody>
    <tr><td width="230" align="center"><strong>Organização por categoria</strong></td><td width="520">Agrupa arquivos por extensão, usando categorias configuráveis</td></tr>
    <tr><td width="230" align="center"><strong>Simulação e prévia</strong></td><td width="520">Planeja as operações sem alterar arquivos</td></tr>
    <tr><td width="230" align="center"><strong>Filtros</strong></td><td width="520">Filtra por padrão, idade, tamanho, categoria, subdiretórios e arquivos ocultos</td></tr>
    <tr><td width="230" align="center"><strong>Renomeação em massa</strong></td><td width="520">Usa padrões com <code>{name}</code>, <code>{ext}</code>, <code>{seq}</code> e <code>{date}</code></td></tr>
    <tr><td width="230" align="center"><strong>Arquivamento</strong></td><td width="520">Move arquivos antigos para <code>Arquivo/AAAA/</code> quando solicitado</td></tr>
    <tr><td width="230" align="center"><strong>Relatórios</strong></td><td width="520">Gera relatórios em Markdown, CSV ou JSON</td></tr>
    <tr><td width="230" align="center"><strong>Desfazer</strong></td><td width="520">Usa o journal para restaurar uma execução anterior, quando possível</td></tr>
    <tr><td width="230" align="center"><strong>Diagnóstico</strong></td><td width="520">Exibe informações de CPU, memória, disco, processo e permissões</td></tr>
    <tr><td width="230" align="center"><strong>Automação</strong></td><td width="520">Inclui scripts e opções de agendamento para Linux/macOS e Windows</td></tr>
    <tr><td width="230" align="center"><strong>Interface gráfica</strong></td><td width="520">Aplicativo nativo para Windows, Linux e macOS, além da interface web local</td></tr>
  </tbody>
</table>

## Segurança em primeiro lugar

- `organize` apenas simula por padrão; use `--apply` para executar.
- Operações reais pedem confirmação, exceto quando `--yes` é informado.
- Arquivos não são sobrescritos nem excluídos; colisões recebem um nome único.
- As operações são registradas em journal e podem ser desfeitas conforme o estado dos arquivos.
- O aplicativo funciona localmente e não envia os arquivos para um servidor.

> A demonstração online é ilustrativa. Para organizar arquivos do computador, use o aplicativo ou a CLI local.

## Requisitos

### Requisitos funcionais

<table width="750">
  <thead>
    <tr><th width="230" align="center">Código</th><th width="520">Requisito</th></tr>
  </thead>
  <tbody>
    <tr><td width="230" align="center"><strong>RF01</strong></td><td width="520">Analisar uma pasta e planejar a organização dos arquivos</td></tr>
    <tr><td width="230" align="center"><strong>RF02</strong></td><td width="520">Permitir filtros, categorias e regras de renomeação configuráveis</td></tr>
    <tr><td width="230" align="center"><strong>RF03</strong></td><td width="520">Exibir uma prévia antes de executar operações</td></tr>
    <tr><td width="230" align="center"><strong>RF04</strong></td><td width="520">Aplicar operações somente mediante solicitação explícita</td></tr>
    <tr><td width="230" align="center"><strong>RF05</strong></td><td width="520">Registrar operações, gerar relatórios e permitir desfazer uma execução</td></tr>
    <tr><td width="230" align="center"><strong>RF06</strong></td><td width="520">Diagnosticar recursos e permissões relevantes do sistema</td></tr>
  </tbody>
</table>

### Requisitos não funcionais

<table width="750">
  <thead>
    <tr><th width="230" align="center">Código</th><th width="520">Requisito</th></tr>
  </thead>
  <tbody>
    <tr><td width="230" align="center"><strong>RNF01</strong></td><td width="520">Segurança por padrão: simular antes de aplicar</td></tr>
    <tr><td width="230" align="center"><strong>RNF02</strong></td><td width="520">Não sobrescrever nem excluir arquivos</td></tr>
    <tr><td width="230" align="center"><strong>RNF03</strong></td><td width="520">Executar a CLI em Windows, Linux e macOS com <code>Python 3.10+</code></td></tr>
    <tr><td width="230" align="center"><strong>RNF04</strong></td><td width="520">Não exigir dependências externas para a CLI; <code>pywebview</code> é opcional para a janela nativa</td></tr>
    <tr><td width="230" align="center"><strong>RNF05</strong></td><td width="520">Manter registros locais para apoiar a reversibilidade</td></tr>
  </tbody>
</table>

## Glossário

<table width="750">
  <thead>
    <tr><th width="230" align="center">Termo</th><th width="520">Significado</th></tr>
  </thead>
  <tbody>
    <tr><td width="230" align="center"><strong>Simulação</strong></td><td width="520">Plano exibido sem alterar arquivos</td></tr>
    <tr><td width="230" align="center"><strong>Journal</strong></td><td width="520">Registro local das operações de uma execução</td></tr>
    <tr><td width="230" align="center"><strong>Undo</strong></td><td width="520">Tentativa segura de restaurar uma execução registrada</td></tr>
    <tr><td width="230" align="center"><strong>CLI</strong></td><td width="520">Interface de linha de comando</td></tr>
  </tbody>
</table>

## Veja também

- [Guia de uso](GUIA-DE-USO.md) — exemplos práticos de cada recurso
- [Arquitetura](ARQUITETURA.md) — como os módulos implementam essas funções
- [Conceitos de Sistemas Operacionais](CONCEITOS-SO.md) — a teoria por trás do projeto
