import WebSocket from "ws";

export interface Player {
  name: string;
  password: string;
  socket: WebSocket;
  id: number;
  win: number;
  ships?: Array<Ship>;
  enemyCoordinates?: Array<Coordinate>;
}

export interface Coordinate {
  alive: number;
  positions: Array<Position>;
}

export interface Position {
  x: number;
  y: number;
  destroyed?: boolean;
}

export interface Ship {
    position: Position;
    direction: boolean;
    type: "small" | "medium" | "large" | "huge";
    length: number;
}

export interface Response {
  type: string,
  data: string,
  id: number
}

export const players: Array<Player> = [];

export const rooms: Record<string, { players: Array<Player> }> = {};

export const games: Record<string, { players: Array<Player>; turn?: number }> =
  {};
