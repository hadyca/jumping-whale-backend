import bithumbHeader from "../../utils/bithumbHeader";
import fetch from "node-fetch";

//빗썸 시장가 매수 주문
export default async function getMyAccount(coinName) {
  try {
    const PAY_CURRENCY = "KRW";

    const req_query = {
      endpoint: "/info/account",
      order_currency: coinName,
      payment_currency: PAY_CURRENCY,
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
    console.log(resData.data);
    return resData.data.balance;
  } catch (error) {
    console.log("빗썸 내 정보 fetch 에러", error);
  }
}
