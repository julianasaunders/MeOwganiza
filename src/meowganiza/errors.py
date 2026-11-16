"""Exceções de domínio do MeOwganiza."""


class MeOwganizaError(Exception):
    """Erro esperado da aplicação, exibido de forma amigável na CLI."""


class ConfigError(MeOwganizaError):
    """Configuração ausente, inválida ou incompatível."""


class PlanError(MeOwganizaError):
    """Não foi possível montar um plano de operações seguro."""


class JournalError(MeOwganizaError):
    """Falha ao ler ou gravar o histórico de execuções."""
