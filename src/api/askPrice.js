import fetch from "node-fetch";

export default async function getAskPrice(COIN_PAY) {
  try {
    const res = await fetch(
      `https://api.bithumb.com/public/orderbook/${COIN_PAY}?count=1`,
      { cache: "no-store" }
    );
    const result = await res.json();
    return result.data.asks[0].price;
  } catch (error) {
    console.log("빗썸 오더북 fetch 에러", error);
  }
}
