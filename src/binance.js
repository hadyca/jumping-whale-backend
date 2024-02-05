import binanceClient from "./binanceClient";

export default async function binance(req, res, next) {
  try {
    const test = await binanceClient.getBalance();
    res.send(test);
  } catch (error) {
    console.log(error);
  }
}
