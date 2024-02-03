import MarketBuy from "./marketBuy";
import getMyBalance from "./myBalance";
import getAskPrice from "./askPrice";
import getOrderDetail from "./orderDetail";
import limitSell from "./limitSell";
import limitBuy from "./limitBuy";

export default async function trading({
  coinName,
  coin_pay,
  beforeRsi,
  nowRsi,
  setRowRsi,
  setHighRsi,
}) {
  console.log(
    `🚀 트레이딩 감시 중...직전 RSI:${beforeRsi}, 현재 RSI:${nowRsi}`
  );
  if (
    (beforeRsi < setRowRsi && nowRsi > setRowRsi) ||
    (beforeRsi < setHighRsi && nowRsi > setHighRsi)
  ) {
    // 매도1호가
    const askPrice = await getAskPrice(coinName, coin_pay);

    //내가 가진 현금
    const myCash = await getMyBalance(coinName);
    const intMyCash = Math.floor(myCash);

    // 현금 / 매수1호가 = 내가 살 수 있는 수량 (소수점 4자리), 현금 * %하여 수량 조절가능
    const percent = 1 - 0.0025; //내 보유현금의 %만 쓰겠다.
    // const finalPercent = percent === 1 ? 0.75 : percent;
    const finalMycash = intMyCash * percent;
    console.log("최종내캐쉬:", finalMycash);
    const availableBuyVolume = finalMycash / askPrice;
    console.log("살수있는수량:", availableBuyVolume);
    const fourDecimalVolume = String(
      Math.floor(availableBuyVolume * 10000) / 10000
    );
    //자동 시장가 매수 (일단 매수 가능 수량 100%로 매수)
    //TO-BE시장가 매수 내가 가진 현금 100% 못쓰게 막아놨다.. 대략 원래 가진 현금의 77~78%정도만 쓸 수 있게해놓음..
    //그래서 77~78%를 순간적으로 드르륵 다 사게 하는 방법이 있겠지만,, 그보다 지정가 매수로 시도해보자.
    //지정가 매수때는 수량은 4자리까지 입력가능하다..
    const limitBuyId = await limitBuy(coinName, fourDecimalVolume, askPrice);
    // const marketBuyId = await MarketBuy(fourDecimalVolume, coinName);
    // 주문내역 (내가 주문한거 오더id넣고 산 코인 1개당 단가, 갯수, 얼마주고 샀는지)
    // const orderId = "C0101000001420278764"; 실제 예시
    if (limitBuyId) {
      const buyDetail = await getOrderDetail(limitBuyId, coinName);
      //주문했던 수량
      const orderedVolume = buyDetail.contract[0].units;
      //주문했던 1개당 코인단가
      const orderedUnitPrice = parseFloat(buyDetail.contract[0].price);
      console.log("주문했던 코인단가:", orderedUnitPrice);
      //매수가 대비 목표 수익률 및 수익목표액(개당 단가) 로직
      const PROFIT_PERCENT = 0.0005; //0.05%
      const intTargetSellPrice = parseInt(
        orderedUnitPrice + orderedUnitPrice * PROFIT_PERCENT
      );
      const fianlTargetSellPrice = String(
        Math.round(intTargetSellPrice / 1000) * 1000
      );
      // 지정가 매도 (익절)
      const limitSellId = await limitSell(
        coinName,
        orderedVolume,
        fianlTargetSellPrice
      );
      console.log("지정가 매도 ID : ", limitSellId);
      console.log("지정가 매도까지 진행된 현재RSI :", nowRsi);

      //지정가 매도 ID로 다시 조회한 후 complete냐 아니냐에 따라서 다시 또 앱 구동
      // const sellDetail = await getOrderDetail(limitBuyId, coinName);
      return limitSellId;
    }
  }
  return;
}
