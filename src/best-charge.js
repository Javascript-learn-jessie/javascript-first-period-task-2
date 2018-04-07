var loadAllItems = require('./items.js');
var loadPromotions = require('./promotions.js');
function getInitOrderPrice(selectedItems,itemInfo){
    let singleSummary = [];
    let totalSummary = 0;
    let selectedItemInfo = [];
    for (var selectedItem of selectedItems) {
        let itemName;
        let itemId;
        let itemNum;
        let itemTotalPrice;
        let sItem = selectedItem.split('x');
        itemId = sItem[0].trim();
        itemNum = sItem[1].trim();
        for (let item of itemInfo) {
          if (item.id == itemId) {
            itemTotalPrice = parseInt(itemNum) * item.price;
            let singleStr = item.name + ' x ' + itemNum + ' = ' + itemTotalPrice + '元';
            singleSummary.push(singleStr);
            totalSummary += itemTotalPrice;
            selectedItemInfo.push(item);
          }
        }
      }
      return [singleSummary,totalSummary,selectedItemInfo];
}
function getPromotionOrderPrice(selectedItemInfo,totalSummary,promotionInfo){
    let promotionSummaryOne=0;
    let promotionSummaryTwo= totalSummary;
    let promotionFlag = false;
    let promotionType;
    let promotionPrice;
    if (totalSummary >= 30) {
      promotionSummaryOne = totalSummary - 6;
      promotionFlag = true;
    }
    /*第二种方案 优惠后价格*/
    var promotionItemName=[];
    for (let promotionItem of promotionInfo[1].items) {
      for (let item of selectedItemInfo) {
        if (promotionItem == item.id) {
          promotionSummaryTwo -= item.price * 0.5;
          promotionItemName.push(item.name);
          promotionFlag = true;
        }
      }
    }
    /**决定哪种优惠方式，flag标志是否使用优惠 */
    if (promotionFlag) {
      if (promotionSummaryOne <= promotionSummaryTwo) {
        promotionPrice = totalSummary - promotionSummaryOne;
        totalSummary = promotionSummaryOne;
        promotionType = promotionInfo[0].type;
      } else {
        promotionPrice = totalSummary - promotionSummaryTwo;
        totalSummary = promotionSummaryTwo;
        promotionType = promotionInfo[1].type;
        let nameStr=promotionItemName[0].toString();
        for(let i=1;i<promotionItemName.length;i++){
          nameStr += "，"+promotionItemName[i];
        }
        promotionType += "("+nameStr+")";
      }
    }
    return [promotionType,promotionPrice,totalSummary,promotionFlag];
}
function printOrder(singleSummary,totalSummary,promotionType,promotionPrice,promotionFlag){
    var result="";
    result += "============= 订餐明细 =============\n";
    for (let singleSum of singleSummary) {
      result += singleSum;
      result += "\n";
    }
    result += "-----------------------------------\n";
    if (promotionFlag) {
      result += "使用优惠:\n";
      result += promotionType + "，省" + promotionPrice + "元\n";
      result += "-----------------------------------\n";
    }
  
    result+="总计："+totalSummary+"元\n";
    result += "===================================\n";
    return result;    
}
function bestCharge(selectedItems) {
  var itemInfo = loadAllItems();
  var promotionInfo = loadPromotions();
  var singleSummary = [];
  var totalSummary = 0;
  var selectedItemInfo = [];
  var promotionType, promotionPrice,promotionFlag;
  var result = "";
  singleSummary = getInitOrderPrice(selectedItems,itemInfo)[0];
  totalSummary = getInitOrderPrice(selectedItems,itemInfo)[1];
  selectedItemInfo = getInitOrderPrice(selectedItems,itemInfo)[2];

  promotionType = getPromotionOrderPrice(selectedItemInfo,totalSummary,promotionInfo)[0];
  promotionPrice = getPromotionOrderPrice(selectedItemInfo,totalSummary,promotionInfo)[1];
  totalSummary = getPromotionOrderPrice(selectedItemInfo,totalSummary,promotionInfo)[2];
  promotionFlag = getPromotionOrderPrice(selectedItemInfo,totalSummary,promotionInfo)[3];
  
  result = printOrder(singleSummary,totalSummary,promotionType,promotionPrice,promotionFlag);
  return result;
}
module.exports = bestCharge;