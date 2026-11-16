# -*- coding: utf-8 -*-
"""Entry point para o executável gráfico do MeOwganiza (sem console)."""

import sys
from pathlib import Path

src = Path(__file__).resolve().parent / "src"
if str(src) not in sys.path:
    sys.path.insert(0, str(src))

from meowganiza.native import run_native

if __name__ == "__main__":
    raise SystemExit(run_native())
