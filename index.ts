import {
  handlePlayerRegistration,
  handleAddUserToRoom,
  handleAddShips,
  handleAttack,
  handleCreateRoom,
  handleRandomAttack,
  handleDisconnect,
} from "./src/handlers";
import WebSocket from "ws";
import { httpServer } from "./src/http_server/index";

const HTTP_PORT = 8181;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);

const server = new WebSocket.Server({ port: 3000 });

console.log(server.address(), 'started')

server.on("connection", (socket: WebSocket) => {
  console.log("A player has connected.");

  socket.on("message", (message: string) => {
    const response = JSON.parse(message);
    console.log(response, "response");

    if (response.type === "reg") {
      handlePlayerRegistration(socket, response);
    } else if (response.type === "create_room") {
      handleCreateRoom(socket);
    } else if (response.type === "add_user_to_room") {
      handleAddUserToRoom(socket, response);
    } else if (response.type === "add_ships") {
      handleAddShips(response);
    } else if (response.type === "attack") {
      handleAttack(response);
    } else if (response.type === "randomAttack") {
      handleRandomAttack(response);
    }
  });

  socket.on("close", () => {
    handleDisconnect(socket);
  });
});
