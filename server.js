
const config = require('./config');
require('./models/connection');
const stockPrice = require('./models/stockPrices')
const apiFetchStockData = require('./analysis/apiFetchPrices');
const {createDailyPriceWithRsiArray,simulateBuyAndSell} = require('./analysis/createDailyPriceArray');
console.log("- c'est parti! dans server.js -")

// To make server
const express = require('express')
const app = express()
// app.set('view engine', 'ejs');
const path = require('path');

// // // Serve static files from the 'public' directory
// // app.use(express.static(path.join(__dirname, 'public')));
// // Middleware to serve static files
// app.use(express.static('public'))
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Setup view engine as EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.get("/", (req,res)=>{
    const tickerSymbol = "BOIL"
    createDailyPriceWithRsiArray(tickerSymbol).then(arryStock =>{
    
        const arraySimulatedDailyAction = simulateBuyAndSell(arryStock, 30, 70, 10000,"2019-01-01")

        // Format date and RSI
        for (let elem of arraySimulatedDailyAction){
            elem.date = elem.date.toISOString().split('T')[0]
            elem.rsi = Math.round(elem.rsi * 100) /100
            elem.cash = Math.round(elem.cash * 100) /100
        }
        const options = {arraySimulatedDailyAction:arraySimulatedDailyAction, tickerSymbol:tickerSymbol}
        res.render("index", options);
    })
});



app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
