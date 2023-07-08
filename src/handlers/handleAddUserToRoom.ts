import WebSocket from "ws";
import { getData } from "../utils";
import { Player, Response, games, players, rooms } from "../../db";

const handleAddUserToRoom = (socket: WebSocket, response: Response) => {
  const data = getData(response);
  const roomId = data.indexRoom;
  const playerInfo = players.find((player) => player.socket === socket) as Player;
  const isPlayerAlreadyInRoom = rooms[roomId].players.find(
    (player: Player) => player.name === playerInfo?.name
  );
  if (isPlayerAlreadyInRoom) {
    return;
  }
  rooms[roomId] = {
    players: [...rooms[roomId]?.players, playerInfo],
  };

  games[roomId] = { players: rooms[roomId].players };

  if (rooms[roomId].players.length === 2) {
    rooms[roomId].players.map((player: Player) => {
      player.socket.send(
        JSON.stringify({
          type: "create_game",
          data: JSON.stringify({ idPlayer: player.id, idGame: roomId }),
          id: 0,
        })
      );
      player.socket.send(
        JSON.stringify({
          type: "update_room",
          data: JSON.stringify([]),
          id: 0,
        })
      );
      console.log(`Game ${roomId} was created`)
    });
  }
  // logInfo();
};

export default handleAddUserToRoom;
