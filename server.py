#!/usr/bin/env python3
import http.server
import socketserver
import argparse

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Simple HTTP server with CORS')
    parser.add_argument('--port', type=int, default=8000, help='Port to serve on')
    args = parser.parse_args()

    handler = CORSRequestHandler
    with socketserver.TCPServer(('', args.port), handler) as httpd:
        print(f"Serving at http://localhost:{args.port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down...")
            httpd.server_close()
