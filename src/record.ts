import { Socket } from "dgram";
import * as portAudio from "naudiodon";
import * as net from "net";

export class Recorder {
  ai: portAudio.IoStreamRead | null;
  socket: net.Socket | null;
  onTextBack: (text: string) => void;

  constructor(onTextBack: (text: string) => void) {
    this.onTextBack = onTextBack;
    this.ai = null;
    this.socket = null;
  }

  createAI() {
    this.ai = portAudio.AudioIO({
      inOptions: {
        channelCount: 2,
        sampleFormat: portAudio.SampleFormat16Bit,
        sampleRate: 16000,
        deviceId: 2,
        closeOnError: true,
      },
    });
  }

  createSocket() {
    this.socket = net.connect({ host: "localhost", port: 8080 }, () => {
      console.log("[record] connected to server");
      if (this.ai && this.socket) {
        this.ai.pipe(this.socket);
      }
    });

    this.socket.on("error", (e) => {
      console.log("[record] error:");
      console.log(e);
    });

    this.socket.on("data", (data) => {
      console.log(`[record] data:`);
      console.log(data);
      this.onTextBack(data.toString());
    });
  }

  start() {
    if (this.ai) {
      this.ai.quit();
    }
    if (this.socket) {
      this.socket.end();
    }

    this.createAI();
    this.createSocket();

    if (this.ai) {
      this.ai.start();
    }
  }

  stop() {
    if (this.ai) {
      this.ai.quit();
    }
    if (this.socket) {
      this.socket.end();
    }
  }
}
