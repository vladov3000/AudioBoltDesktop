import socketserver


class TestTCPHandler(socketserver.BaseRequestHandler):
    def handle(self):
        self.data = self.request.recv(1024).strip()
        self.request.sendall(b"hello world")


if __name__ == "__main__":
    HOST, PORT = "localhost", 8080

    with socketserver.TCPServer((HOST, PORT), TestTCPHandler) as server:
        print(f"Listening on {HOST}: {PORT}")
        server.serve_forever()
