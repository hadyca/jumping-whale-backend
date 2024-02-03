import bithumbHeader from "../utils/bithumbHeader";
import fetch from "node-fetch";

export default async function getOrderDetail(orderId, coinName) {
  const req_query = {
    endpoint: "/info/order_detail",
    order_id: orderId,
    order_currency: coinName,
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
    if (resData.data.order_status === "Completed") {
      return resData.data;
    } else {
      console.log("주문상태가 완료되지 않아 다시 fetch합니다...");
      setTimeout(getOrderDetail, 1000);
    }
  } catch (error) {
    console.log("빗썸 거래 주문내역  fetch 에러", error);
  }
}
