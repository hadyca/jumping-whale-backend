import fetch from "node-fetch";

export default async function getCandle(coin_pay, interval) {
  try {
    const res = await fetch(
      `https://api.bithumb.com/public/candlestick/${coin_pay}/${interval}`,
      { cache: "no-store" }
    );
    const result = await res.json();
    return result.data;
  } catch (error) {
    console.log("빗썸 캔들봉 fetch 에러", error);
  }
}
