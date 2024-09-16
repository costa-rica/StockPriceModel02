require('../models/connection');
const stockPrice = require('../models/stockPrices')


function createDailyPriceWithRsiArray(tickerSymbol) {
    console.log("- in createDailyPriceWithRsiArray")
    return stockPrice.find({ ticker: tickerSymbol }).sort({ date: 1 }).then(stockPrices => {
        let dailyPriceWithRSI = [];

        for (let i = 14; i < stockPrices.length; i++) {
            let gains = 0;
            let losses = 0;

            for (let j = i - 14; j < i; j++) {
                const diff = stockPrices[j + 1].close - stockPrices[j].close;
                if (diff >= 0) {
                    gains += diff;
                } else {
                    losses -= diff;
                }
            }

            const avgGain = gains / 14;
            const avgLoss = losses / 14;
            const rs = avgGain / avgLoss;
            const rsi = 100 - (100 / (1 + rs));

            dailyPriceWithRSI.push({
                ...stockPrices[i].toObject(),// .toObject() converts mongoose documents to plain JavaScript objects
                rsi: rsi
            });
        }

        return dailyPriceWithRSI;
    }).catch(error => {
        throw error;
    });
}


function simulateBuyAndSell(dailyPriceWithRSI, buyRsi, sellRsi, startCash, startDate='9999') {

    // let cash = startCash
    // let qtyStock = 0
    // let equityInStock = 0
    let arraySimulatedDailyAction = []
    let buysCount = 0
    let sellsCount = 0

    console.log(`length: ${dailyPriceWithRSI.length}`)
    if (startDate != '9999'){
        console.log(`removing dates prior to: ${startDate}`)
        for (let i=0;i<dailyPriceWithRSI.length;i++){
            if (dailyPriceWithRSI[i].date >= Date.parse(startDate)){
                // console.log(`BREAKINg at : ${dailyPriceWithRSI[i].date}`)
                dailyPriceWithRSI = dailyPriceWithRSI.splice(i)
                break
            }
        }
    }
    console.log(`length (afgter): ${dailyPriceWithRSI.length}`)
    
    for (let i = 0; i < dailyPriceWithRSI.length; i++) {
        
        let dailySimulationObject = {}
        // console.log(`dailyPriceWithRSI[i]: ${dailyPriceWithRSI[i].open}`)
        // console.log(`dailyPriceWithRSI[i] typeof: ${ typeof dailyPriceWithRSI[i]}`)
        if (i ==0) {
            dailySimulationObject = {
                ...dailyPriceWithRSI[i], // toObject() not needed b/c dailyPriceWithRsi is already a plain JavaScript object
                cash: startCash,
                qtyStock: 0,
                equityInStock:0,
                buysCount: buysCount,
                sellsCount: sellsCount,
            }
        } else {
            dailySimulationObject = {
                ...dailyPriceWithRSI[i],
                cash: arraySimulatedDailyAction[i-1].cash,
                qtyStock: arraySimulatedDailyAction[i-1].qtyStock,
                equityInStock:arraySimulatedDailyAction[i-1].equityInStock,
                buysCount: buysCount,
                sellsCount: sellsCount,
            }

        }
        // const {rsi, close} = dailyPriceWithRSI[i]
        const {rsi, close, cash, qtyStock } = dailySimulationObject;// order on left side shouldn't matter.

        if (buyRsi >= rsi  && cash >= close) {

            // // Buy stocks
            let newQty = Math.floor(dailySimulationObject.cash / dailySimulationObject.close ) // in case we already have stock

            dailySimulationObject.qtyStock += newQty 
            let newEquityInStock= Math.round(newQty * dailySimulationObject.close * 100) / 100 // round to 2 decimal places using "* 100) /100"
            dailySimulationObject.equityInStock += newEquityInStock
            dailySimulationObject.cash -= newEquityInStock
            buysCount += 1

        } else if (rsi >= sellRsi && qtyStock > 0) {
            // // Sell stocks
            dailySimulationObject.cash += Math.round(dailySimulationObject.qtyStock * dailySimulationObject.close * 100) / 100 // round to 2 decimal places using "* 100) /100"
            dailySimulationObject.equityInStock = 0
            dailySimulationObject.qtyStock = 0
            sellsCount +=1
        } 
        dailySimulationObject.buysCount = buysCount
        dailySimulationObject.sellsCount = sellsCount
        arraySimulatedDailyAction.push(dailySimulationObject)
        if (dailySimulationObject.cash < 0){
            break
        }

    }
    return arraySimulatedDailyAction
}

module.exports = {createDailyPriceWithRsiArray,
    simulateBuyAndSell};

