const config = require('../server');
const mongoose = require('mongoose');
const connectionStringBase = `mongodb+srv://${config.MONGODB_USER}:${config.MONGODB_CLUSTER_PW}@cluster0.8puct.mongodb.net/`
const dbName = 'StockPricesModel'
const connectionString = `${connectionStringBase}${dbName}`;

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
    .then(() => console.log('Database connected'))
    .catch(error => console.error(error));