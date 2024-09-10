import { Server as SocketServer } from "socket.io";
import dotenv from "dotenv";
import {
  publishRecommendationUpdate,
  publishUserInteractionEvent,
} from "./kafka";
import { pub, sub } from "./redis";
dotenv.config();

class SocketService {
  private _io: SocketServer;

  constructor() {
    this._io = new SocketServer({
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
      },
    });
  }

  public get io() {
    return this._io;
  }

  public initListeners() {
    console.log("Initializing listeners");

    this._io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      socket.on("subscribe", (room) => {
        console.log(`Socket ${socket.id} subscribed to ${room}`);
        socket.join(room);

        sub.subscribe(room, (err) => {
          if (err) {
            console.error(`Failed to subscribe to ${room}:`, err);
          } else {
            console.log(`Subscribed to Redis channel: ${room}`);
          }
        });
      });
      socket.on("publish", async (room, message) => {
        console.log(`Publishing to ${room}: ${message}`);
        pub.publish(room, message);
      });

      sub.on("userI", async (channel, message) => {
        console.log(`Received message from ${channel}: ${message}`);
        this._io.to(channel).emit("userI", message);
        await publishUserInteractionEvent({ channel, message });
      });

      sub.on("recommendationU", async (channel, message) => {
        console.log(`Received message from ${channel}: ${message}`);
        this._io.to(channel).emit("recommendationU", message);
        await publishRecommendationUpdate({ channel, message });
      });

      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  public attachToServer(server: any) {
    this._io.attach(server);
    console.log("Socket.IO server attached");
  }
}

export default SocketService;
