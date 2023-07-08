import WebSocket from "ws";
import { rooms, players, Player } from "../../db";

const handleCreateRoom = (socket: WebSocket) => {
  const roomId = Object.keys(rooms).length;
  const playerInfo = players.find((player) => player.socket === socket) as Player;
  rooms[roomId] = { players: [playerInfo] };

  players.map((player: Player) => {
    player.socket.send(
      JSON.stringify({
        type: "update_room",
        id: 0,
        data: JSON.stringify([
          {
            roomId: roomId,
            roomUsers: [
              JSON.stringify({
                name: playerInfo?.name,
                index: playerInfo?.id,
              }),
            ],
          },
        ]),
      })
    );
    console.log(`Room ${roomId} was created by ${playerInfo?.name}`)
  });
  // logInfo();
};

export default handleCreateRoom;
