import WebSocket from "ws";
import { getData } from "../utils";
import { Response, players } from "../../db";

const handlePlayerRegistration = (socket: WebSocket, response: Response) => {
  const data = getData(response);
  const { name, password } = data;
  const isExist = players.find((player) => player.name === name);
  if (!isExist) {
    players[players.length] = { ...data, socket, id: players.length, win: 0 };

    socket.send(
      JSON.stringify({
        type: "reg",
        data: JSON.stringify({
          name,
          index: players.length - 1,
          error: false,
        }),
        id: 0,
      })
    );
    console.log(`Player ${name} registered`)
  } else {
    if (isExist.password !== password) {
      socket.send(
        JSON.stringify({
          type: "reg",
          data: JSON.stringify({
            name: isExist.name,
            index: isExist.id,
            error: true,
            errorText: "Не правильный пароль",
          }),
          id: 0,
        })
      );
      console.log(`Player ${isExist.name} wrond password`)
    } else {
      isExist.socket = socket;
      socket.send(
        JSON.stringify({
          type: "reg",
          data: JSON.stringify({
            name: isExist.name,
            index: isExist.id,
            error: false,
          }),
          id: 0,
        })
      );
      console.log(`Player ${isExist.name} logined`)
    }
  }
  // logInfo();
};

export default handlePlayerRegistration;
