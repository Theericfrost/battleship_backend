import { players, rooms, games, Ship, Coordinate, Response, Position } from "../../db";

export const logInfo = () => {
  console.log(players, "players");
  console.log(rooms, "rooms");
  console.log(games, "games");
};

export const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getData = (response: Response) => {
  const data = JSON.parse(response.data);
  data.id = response.id;
  return data;
};

export const getCordinates = (data: Array<Ship>) => {
  const newData: Array<Coordinate> = [];

  data.forEach(({ position, direction, length }: Ship) => {
    if (length === 1) {
      newData.push({ alive: 1, positions: [position] });
    } else {
      const positions: Position[] = [];
      positions.push(position);
      for (let i = 1; i < length; i++) {
        let newPosition = { ...position };
        if (direction === false) {
          newPosition.x = newPosition.x + i;
          positions.push(newPosition);
        } else {
          newPosition.y = newPosition.y + i;
          positions.push(newPosition);
        }
      }
      newData.push({
        alive: positions.length,
        positions,
      });
    }
  });

  return newData;
};
