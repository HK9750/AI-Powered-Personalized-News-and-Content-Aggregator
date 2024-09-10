import http from "http";
import app from "./app";
import SocketService from "./config/socketio"; // Adjust the path as needed
import {
  setupUserInteractionConsumer,
  setupRecommendationConsumer,
} from "./config/kafkaPC";

(async () => {
  try {
    await setupUserInteractionConsumer();
    await setupRecommendationConsumer();

    const socketService = new SocketService();
    const server = http.createServer(app);
    socketService.attachToServer(server);

    server.listen(8000, () => {
      console.log("Server is running on http://localhost:8000");
    });
    socketService.initListeners();
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1); // Exit on error
  }
})();
