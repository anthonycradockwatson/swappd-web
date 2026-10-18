#!/usr/bin/env python3
"""Local dev server that disables caching so edits show up on a normal refresh."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

if __name__ == "__main__":
    ThreadingHTTPServer(("", 8000), NoCacheHandler).serve_forever()
