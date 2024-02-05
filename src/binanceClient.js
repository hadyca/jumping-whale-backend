require("dotenv").config();
const { USDMClient } = require("binance");

const binanceClient = new USDMClient({
  api_key: process.env.BINANCE_OPEN_API_ACCESS_KEY,
  api_secret: process.env.BINANCE_OPEN_API_SECRET_KEY,
});

export default binanceClient;
