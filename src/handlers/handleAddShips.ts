import { getData, randomIntFromInterval } from "../utils";
import { Player, games, Response } from "../../db";

const handleAddShips = (response: Response) => {
  const data = getData(response);

  const { gameId, ships, indexPlayer } = data;
  const gameData = games[gameId];
  const currentPlayer = gameData.players.find(
    (player: Player) => player.id === indexPlayer
  );

  if (!currentPlayer) return;

  const randomOrder = randomIntFromInterval(0, 1);

  currentPlayer.ships = ships;
  gameData.turn = randomOrder;
  if (
    gameData.players.length === 2 &&
    gameData.players.every((player: Player) => player.ships)
  ) {
    gameData.players.forEach((player: Player) => {
      player.socket.send(
        JSON.stringify({
          type: "start_game",
          data: JSON.stringify({
            ships: JSON.stringify(player.ships),
            currentPlayerIndex: player.id,
          }),
          id: 0,
        })
      );
      player.socket.send(
        JSON.stringify({
          type: "turn",
          data: JSON.stringify({
            currentPlayer: randomOrder,
          }),
          id: 0,
        })
      );
    });
    console.log(`Ships were added`)
  }
};

export default handleAddShips;
