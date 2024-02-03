import getCandle from "./api/candle";
import getClosingPrice from "./utils/reverse_closing";
import calculateRsi from "./utils/calculateRsi";
import trading from "./api/trading";

export default async function start(req, res, next) {
  const INTERVAL_TYPE = {
    "1min": "1m",
    "3mins": "3m",
    "5mins": "5m",
    "10mins": "10m",
    "30mins": "30m",
    "1hour": "1h",
    "6hour": "6h",
    "12hour": "12h",
    "24hour": "24h",
  };

  const COIN_PAY = "BTC_KRW";
  const INTERVAL = INTERVAL_TYPE["5mins"];
  const SET_ROW_RSI = 30;
  const SET_HIGH_RSI = 70;
  const COIN_NAME = "BTC";

  //candle값 가져오기
  const candleData = await getCandle(COIN_PAY, INTERVAL);

  //200개 종가 배열 [과거->최신순]
  const closingPriceArr = getClosingPrice(candleData);

  const rsiData = calculateRsi(closingPriceArr);
  // 가져온 rsi값으로 매매하기
  const finalResult = await trading({
    coinName: COIN_NAME,
    coin_pay: COIN_PAY,
    beforeRsi: rsiData.beforeRsi,
    nowRsi: rsiData.nowRsi,
    setRowRsi: SET_ROW_RSI,
    setHighRsi: SET_HIGH_RSI,
  });

  if (finalResult === undefined) {
    setTimeout(start, 1000);
  } else {
    console.log("🎉 트레이딩 완료!");
    next();
  }
}
