import { getCordinates, getData } from "../utils";
import { Coordinate, Player, Position, Response, Ship, games } from "../../db";

const handleAttack = (response: Response) => {
  const data = getData(response);
  const { gameId, x, y, indexPlayer } = data;
  const gameData = games[gameId];
  const currentPlayer = gameData.players.find(
    (player: Player) => player.id === indexPlayer
  );
  const enemyPlayer = gameData.players.find(
    (player: Player) => player.id !== indexPlayer
  );
  let isCurrentPlayerWin = false;

  if (gameData.turn === currentPlayer?.id) {
    if (!currentPlayer?.enemyCoordinates && currentPlayer) {
      currentPlayer.enemyCoordinates = getCordinates(enemyPlayer?.ships as Ship[]);
    }

    const atackedShipData = currentPlayer?.enemyCoordinates?.find(
      (coordinate: Coordinate) =>
        coordinate.positions.find(
          (position: Position) => position.x === x && position.y === y
        )
    );

    if (atackedShipData) {
      console.log(`Player ${currentPlayer?.name} atacked x: ${x} and y: ${y} `)
      const currentPosition = atackedShipData.positions.find(
        (position: { x: number; y: number }) =>
          position.x === x && position.y === y
      );
      if (!currentPosition?.destroyed && currentPosition) {
        atackedShipData.alive = atackedShipData.alive - 1;
        currentPosition.destroyed = true;
      }

      gameData.players.forEach((player: Player) => {
        player.socket.send(
          JSON.stringify({
            type: "attack",
            data: JSON.stringify({
              position: {
                x,
                y,
              },
              currentPlayer: currentPlayer?.id,
              status: "shot",
            }),
            id: 0,
          })
        );
        if (atackedShipData.alive === 0) {
          atackedShipData.positions.forEach(
            (position: Position) => {
              player.socket.send(
                JSON.stringify({
                  type: "attack",
                  data: JSON.stringify({
                    position: {
                      x: position.x,
                      y: position.y,
                    },
                    currentPlayer: currentPlayer?.id,
                    status: "killed",
                  }),
                  id: 0,
                })
              );
            }
          );
        }
        if (
          currentPlayer?.enemyCoordinates &&
          currentPlayer?.enemyCoordinates.every(
            (coordinate: Coordinate) => coordinate.alive === 0
          )
        ) {
          isCurrentPlayerWin = true;
        }
      });
      if (isCurrentPlayerWin && currentPlayer) {
        currentPlayer.win = currentPlayer?.win + 1;
        console.log(`Player ${currentPlayer?.name} win game`)
        gameData.players.forEach((player: Player) => {
          player.socket.send(
            JSON.stringify({
              type: "finish",
              data: JSON.stringify({
                winPlayer: currentPlayer.id,
              }),
              id: 0,
            })
          );
          player.socket.send(
            JSON.stringify({
              type: "update_winners",
              data: JSON.stringify([
                {
                  name: currentPlayer?.name,
                  wins: currentPlayer?.win,
                },
              ]),
              id: 0,
            })
          );
        });
      }
    } else {
      console.log(`Player ${currentPlayer?.name} missed x: ${x} and y: ${y} `)
      gameData.players.forEach((player: Player) => {
        player.socket.send(
          JSON.stringify({
            type: "attack",
            data: JSON.stringify({
              position: {
                x,
                y,
              },
              currentPlayer: currentPlayer?.id,
              status: "miss",
            }),
            id: 0,
          })
        );
        player.socket.send(
          JSON.stringify({
            type: "turn",
            data: JSON.stringify({
              currentPlayer: enemyPlayer?.id,
            }),
            id: 0,
          })
        );
        gameData.turn = enemyPlayer?.id;
      });
    }
  }
};

export default handleAttack;
