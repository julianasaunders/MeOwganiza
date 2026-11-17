"""Aplicativo desktop multiplataforma do MeOwganiza.

Usa a interface web (ui/app.html) e o mesmo servidor local (web.py), exibido
em uma janela nativa via pywebview. A janela é ``frameless``: a decoração e os
controles (minimizar, maximizar, fechar) são desenhados pela própria interface,
como em um editor moderno, sem a moldura padrão do sistema operacional.
"""

from __future__ import annotations

import socket
import threading
import time
import webbrowser

from .errors import MeOwganizaError
from .web import run_web as _run_web_unused  # noqa: F401

_WINDOW = None


def _free_port(host: str = "127.0.0.1") -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((host, 0))
        return s.getsockname()[1]


class _Api:
    """API exposta ao JavaScript da interface para controlar a janela nativa."""

    def _window(self):
        import webview

        return _WINDOW or (webview.windows[0] if webview.windows else None)

    def minimize(self):
        window = self._window()
        if window:
            window.minimize()

    def toggle_maximize(self):
        window = self._window()
        if not window:
            return
        if window.state == window.state.MAXIMIZED:
            window.restore()
        else:
            window.maximize()

    def close(self):
        window = self._window()
        if window:
            window.destroy()

    def state(self):
        window = self._window()
        return str(window.state) if window else ""

    def pick_folder(self):
        try:
            import webview

            window = self._window()
            if window is None:
                return None
            result = window.create_file_dialog(webview.FOLDER_DIALOG)
            if result and len(result) > 0:
                return result[0]
            return None
        except Exception:  # noqa: BLE001
            return None


def run_native(host: str = "127.0.0.1", port: int | None = None) -> int:
    global _WINDOW
    try:
        import webview
    except ImportError as exc:
        raise MeOwganizaError(
            "pywebview não está instalado. Instale com: pip install pywebview"
        ) from exc

    if port is None:
        port = _free_port(host)

    from .web import MeOwganizaHandler
    from http.server import ThreadingHTTPServer

    httpd = ThreadingHTTPServer((host, port), MeOwganizaHandler)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()

    url = f"http://{host}:{port}/app.html"
    for _ in range(50):
        try:
            import urllib.request

            urllib.request.urlopen(url, timeout=1)
            break
        except Exception:  # noqa: BLE001
            time.sleep(0.1)

    _WINDOW = webview.create_window(
        "MeOwganiza 2.0",
        url,
        width=1200,
        height=800,
        resizable=True,
        min_size=(900, 600),
        frameless=True,
        easy_drag=True,
        background_color="#0a3741",
        js_api=_Api(),
    )

    try:
        webview.start(debug=False)
    finally:
        httpd.shutdown()
        httpd.server_close()
    return 0
