const config = require('./config');
require('./models/connection');
const stockPrice = require('./models/stockPrices')
const apiFetchStockData = require('./analysis/apiFetchPrices');
const { createDailyPriceWithRsiArray, simulateBuyAndSell } = require('./analysis/createDailyPriceArray');

// To make server
const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const path = require('path');
// // // Serve static files from the 'public' directory
// // app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))

// To get form data from HTML/frontend
//app.use(express.json()); // Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.route("/")
    .get(simulationArray, (req, res) => {
        console.log("- in GET / route -")
        simulationOptions = res.locals.simulationOptions
        console.log(Object.keys(simulationOptions))
        res.render("index", simulationOptions)
    })
    .post(simulationArray, (req, res) => {
        console.log("- in POST / route -")
        console.log(`Object.keys(req.body): ${Object.keys(req.body)}`)
        console.log(`date selected: ${req.body["inputDate-Nick"]}`)
        console.log(`date selected: ${req.body.date}`)
        simulationOptions = res.locals.simulationOptions
        res.render("index", simulationOptions);
    });

function simulationArray(req, res, next) {
    const tickerSymbol = "BOIL"
    createDailyPriceWithRsiArray(tickerSymbol).then(arryStock => {

        const arraySimulatedDailyAction = simulateBuyAndSell(arryStock, 30, 70, 10000, "2019-01-01")

        // Format date and RSI
        for (let elem of arraySimulatedDailyAction) {
            elem.date = elem.date.toISOString().split('T')[0]
            elem.rsi = Math.round(elem.rsi * 100) / 100
            elem.cash = Math.round(elem.cash * 100) / 100
        }
        const options = { arraySimulatedDailyAction: arraySimulatedDailyAction, tickerSymbol: tickerSymbol }
        // res.render("index", options);
        res.locals.simulationOptions = options
        next()
    })
}


app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});
