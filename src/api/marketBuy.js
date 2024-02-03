import bithumbHeader from "../utils/bithumbHeader";
import fetch from "node-fetch";

export default async function MarketBuy(fourDecimal, coinName) {
  console.log("최종요청매수수량:", fourDecimal);
  const req_query = {
    endpoint: "/trade/market_buy",
    units: fourDecimal,
    order_currency: coinName,
    payment_currency: "KRW",
  };

  const options = {
    method: "POST",
    headers: bithumbHeader(req_query),
    body: new URLSearchParams(req_query),
    cache: "no-store",
  };
  try {
    const res = await fetch(
      `https://api.bithumb.com${req_query.endpoint}`,
      options
    );
    const resData = await res.json();
    console.log("시장가 매수 응답:", resData);
    return resData.order_id;
  } catch (error) {
    console.log("빗썸 시장가 매수 fetch 에러", error);
  }
}
