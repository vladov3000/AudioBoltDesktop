import * as portAudio from "naudiodon";
import * as net from "net";

const SECONDS_PER_INFERENCE = 3;
const HOST = "104.154.202.254";
const PORT = 8086;

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
        framesPerBuffer: 0,
        highwaterMark: 16000 * 4 * SECONDS_PER_INFERENCE,
        maxQueue: 1,
      },
    });

    this.ai.on("error", (e) => {
      console.log("[record] ai error:");
      console.log(e);
    });

    this.ai.on("data", (data: Buffer) => {
      console.log("[record] data available from ai:");
      console.log(data);

      if (this.socket) {
        const bufferSize = new Uint8Array([
          (data.length & 0xff000000) >> 24,
          (data.length & 0x00ff0000) >> 16,
          (data.length & 0x0000ff00) >> 8,
          data.length & 0x000000ff,
        ]);
        this.socket.write(bufferSize);
        this.socket.write(data);
      }
    });

    return this.ai;
  }

  createSocket() {
    this.socket = net.connect({ host: HOST, port: PORT }, () => {
      console.log("[record] connected to server");
    });

    this.socket.on("error", (e) => {
      console.log("[record] socket error:");
      console.log(e);
    });

    this.socket.on("data", (data) => {
      console.log(`[record] data from socket:`);
      console.log(data);
      this.onTextBack(data.toString());
    });

    return this.socket;
  }

  start() {
    if (this.ai) {
      this.ai.quit();
    }

    const ai = this.createAI();
    const socket = this.createSocket();

    //ai.pipe(socket);
    ai.start();
  }

  stop() {
    if (this.ai) {
      this.ai.quit();
      this.ai = null;
    }
    if (this.socket) {
      this.socket.end();
      this.socket = null;
    }
  }
}
