# Stock Price Model 02

This project is a web application that analyzes stock prices and simulates buy and sell actions based on the Relative Strength Index (RSI) indicator. The application is built using Node.js, Express, and EJS.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine.
2. Install the dependencies by running `npm install`.
3. Create a `.env` file in the root directory of the project and add the following environment variables:
   - `PORT`: the port number on which the application will run (default is 3000)
   - `PROJECT_RESOURCES_DIR`: the path to the directory containing project resources
   - `MONGODB_CLUSTER_PW`: the password for the MongoDB cluster (if applicable)
4. Start the application by running `npm start`.
   - run with nodemon (refreshing server): `npm run nodemon_start`
5. Open your browser and navigate to `http://localhost:3000` to view the application.

## Usage

The application has a single route, `/`, which displays the simulated buy and sell actions for the Vanguard S&P 500 ETF (VOO) based on the RSI indicator. The simulated actions are displayed in a table on the index page.

## Dependencies

This project depends on the following packages:

- `dotenv`: loads environment variables from a `.env` file
- `express`: a web application framework for Node.js
- `ejs`: a templating engine for Node.js
- `mongoose`: a MongoDB object modeling tool for Node.js (if applicable)

