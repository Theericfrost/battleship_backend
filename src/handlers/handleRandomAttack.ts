import { Response } from "../../db";
import { randomIntFromInterval } from "../utils";
import handleAttack from "./handleAttack";

const handleRandomAttack = (response: Response) => {
  const data = JSON.parse(response.data);

  const randomX = randomIntFromInterval(0, 9);
  const randomY = randomIntFromInterval(0, 9);
  data.x = randomX;
  data.y = randomY;
  response.data = JSON.stringify(data);
  handleAttack(response);
};

export default handleRandomAttack;
