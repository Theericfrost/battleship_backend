import WebSocket from "ws";
import { Player, players } from "../../db";

const handleDisconnect = (socket: WebSocket) => {
  const playerLeave = players.find(
    (player: Player) => player.socket === socket
  );

  console.log(`Player ${playerLeave?.name} has disconnected.`);
};

export default handleDisconnect;
