"""Entry point para o executável de linha de comando do MeOwganiza."""

import sys
from pathlib import Path

src = Path(__file__).resolve().parent / "src"
if str(src) not in sys.path:
    sys.path.insert(0, str(src))

from meowganiza.cli import main

if __name__ == "__main__":
    raise SystemExit(main())