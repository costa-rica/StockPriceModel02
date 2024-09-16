// // It seems this needs to be up here for the config object to get to the connnection.js
// require('dotenv').config();
// const config = {
//     PORT: process.env.PORT,
//     PROJECT_RESOURCES_DIR: process.env.PROJECT_RESOURCES_DIR,
//     MONGODB_CLUSTER_PW: process.env.MONGODB_CLUSTER_PW,
// };
// const PORT = config.PORT || 3000;
// module.exports = config;// needed for the config object
// server.js
const config = require('./config');

require('./models/connection');
const stockPrice = require('./models/stockPrices')
const apiFetchStockData = require('./analysis/apiFetchPrices');
const {createDailyPriceWithRsiArray,simulateBuyAndSell} = require('./analysis/createDailyPriceArray');
console.log("- c'est parti! dans server.js -")

// To make server
const express = require('express')
const app = express()
app.set('view engine', 'ejs');
const path = require('path');

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));



app.get("/", (req,res)=>{
    const tickerSymbol = "VOO"
    createDailyPriceWithRsiArray(tickerSymbol).then(arryStock =>{
    
        const arraySimulatedDailyAction = simulateBuyAndSell(arryStock, 30, 70, 10000)
        console.log(`dislpaying simulated data:`)
        // console.log(arraySimulatedDailyAction)
        const options = {arraySimulatedDailyAction:arraySimulatedDailyAction, tickerSymbol:tickerSymbol}
        res.render("index", options);
    })
});



app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`);
});
