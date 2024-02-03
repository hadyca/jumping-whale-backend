import bithumbHeader from "../utils/bithumbHeader";
import fetch from "node-fetch";

//빗썸 시장가 매수 주문
export default async function getMyBalance(coinName) {
  try {
    const req_query = {
      endpoint: "/info/balance",
      currency: coinName,
    };

    const options = {
      method: "POST",
      headers: bithumbHeader(req_query),
      body: new URLSearchParams(req_query),
      cache: "no-store",
    };
    const res = await fetch(
      `https://api.bithumb.com${req_query.endpoint}`,
      options
    );
    const resData = await res.json();
    return resData.data.available_krw;
  } catch (error) {
    console.log("빗썸 내 잔고 fetch 에러", error);
  }
}
