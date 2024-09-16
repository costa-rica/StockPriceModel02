// Load the dotenv package to read from the .env file
// require('dotenv').config();
require('dotenv').config();
require('../models/connection');
const stockPrice = require('../models/stockPrices')


function apiFetchStockData(tickerSymbol, requestFull=false){
    console.log("- accessed fetchStockData")
    console.log(`tickerSymbol: ${tickerSymbol}`)
    const baseUrl = "https://www.alphavantage.co"
    let alphavantageUrl = baseUrl
    if (requestFull){
        alphavantageUrl = `${baseUrl}/query?function=TIME_SERIES_DAILY&symbol=${tickerSymbol}&outputsize=full&apikey=${process.env.API_KEY}`
    } else {
        alphavantageUrl = `${baseUrl}/query?function=TIME_SERIES_DAILY&symbol=${tickerSymbol}&apikey=${process.env.API_KEY}`
    }
    
    fetch(alphavantageUrl)
    .then(reponse => reponse.json())
    .then(data => {
        console.log("- received api response - ")
        // console.log("- START print entire response: - ")
        // // console.log(data);

        // console.log("- END print resonse - ")
        // Step 3: Transform the keys into more JavaScript-friendly keys
        const transformedData = {
            MetaData: data['Meta Data'], // Convert 'Meta Data' to 'MetaData'
            TimeSeries: data['Time Series (Daily)'] // Convert 'Time Series (Daily)' to 'TimeSeries'
        };
        // console.log(`ticker: ${transformedData.MetaData["2. Symbol"]}`)
        // console.log(`2024-09-13 price: ${transformedData.TimeSeries["2024-09-13"]}`)
        for (let dayElement in transformedData.TimeSeries) {
            try {
                if (!transformedData.MetaData["2. Symbol"] || !dayElement ||
                    !transformedData.TimeSeries[dayElement]["1. open"] ||
                    !transformedData.TimeSeries[dayElement]["2. high"] ||
                    !transformedData.TimeSeries[dayElement]["3. low"] ||
                    !transformedData.TimeSeries[dayElement]["4. close"] ||
                    !transformedData.TimeSeries[dayElement]["5. volume"]
                ) {
                    throw new Error(`Missing something`);
                }
                const dailyStockPriceElement = new stockPrice({
                    ticker: transformedData.MetaData["2. Symbol"],
                    date: new Date(dayElement),
                    open: +transformedData.TimeSeries[dayElement]["1. open"],
                    high: +transformedData.TimeSeries[dayElement]["2. high"],
                    low: +transformedData.TimeSeries[dayElement]["3. low"],
                    close: +transformedData.TimeSeries[dayElement]["4. close"],
                    volume: +transformedData.TimeSeries[dayElement]["5. volume"],
                })
                // break
                // dailyStockPriceElementArray.push(dailyStockPriceElement)
                dailyStockPriceElement.save()

            } catch (error) {
                console.error("Missing something Error is hte same")
                // Continue to next iteration
                continue;
            }
        }
        console.log("---> FINISHED fetchStockData ---")
        return
    })
}


module.exports = {apiFetchStockData};

