import bithumbHeader from "../utils/bithumbHeader";
import fetch from "node-fetch";

export default async function limitSell(coinName, sellVolume, targetBuyPrice) {
  const SELL = "ask";
  const req_query = {
    endpoint: "/trade/place",
    units: sellVolume,
    order_currency: coinName,
    payment_currency: "KRW",
    price: targetBuyPrice,
    type: SELL,
  };
  console.log(req_query);
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
    console.log("지정가 매도 응답:", resData);
    return resData.order_id;
  } catch (error) {
    console.log("빗썸 지정가 매도 fetch 에러", error);
  }
}
