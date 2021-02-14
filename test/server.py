import socketserver
import struct
import os
from time import gmtime, strftime
import wave


class TestTCPHandler(socketserver.BaseRequestHandler):
    def handle(self):
        while (1):
            # get len
            chunk = self.request.recv(1024).strip()
            target_len = struct.unpack('>i', chunk[:4])[0]
            print(f"Target len: {target_len}")
            data = chunk[4:]

            # get rest of the chunks
            while len(data) < target_len:
                chunk = self.request.recv(1024)
                data += chunk

            # write to file
            filename = self._write_to_file(data)
            self.request.send(b"hello world")

    def _write_to_file(self, data):
        # prepare save dir and filename
        speech_save_dir = os.path.join(os.path.dirname(__file__),
                                       "./temp-audio")

        if not os.path.exists(speech_save_dir):
            os.mkdir(speech_save_dir)

        timestamp = strftime("%Y%m%d%H%M%S", gmtime())
        out_filename = os.path.join(
            speech_save_dir, timestamp + "_" + self.client_address[0] + ".wav")

        # write to wav file
        file = wave.open(out_filename, 'wb')
        file.setnchannels(1)
        file.setsampwidth(4)
        file.setframerate(16000)
        file.writeframes(data)
        file.close()
        return out_filename


if __name__ == "__main__":
    HOST, PORT = "localhost", 8080

    with socketserver.TCPServer((HOST, PORT), TestTCPHandler) as server:
        print(f"Listening on {HOST}: {PORT}")
        server.serve_forever()
