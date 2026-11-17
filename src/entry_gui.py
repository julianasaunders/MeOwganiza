# -*- coding: utf-8 -*-
"""Entry point para o executável gráfico do MeOwganiza (sem console)."""

import sys
from pathlib import Path

# Este arquivo vive dentro de src/, ao lado do pacote meowganiza/. Mantê-lo
# aqui evita que o PyInstaller resolva "meowganiza" para o atalho meowganiza.py
# da raiz, que não é um pacote e quebra os imports (meowganiza.cli, etc.).
src = Path(__file__).resolve().parent
if str(src) not in sys.path:
    sys.path.insert(0, str(src))

from meowganiza.native import run_native

if __name__ == "__main__":
    raise SystemExit(run_native())
