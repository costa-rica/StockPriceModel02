// config.js
require('dotenv').config();

// module.exports = {
//   MONGODB_USER: process.env.MONGODB_USER,
//   MONGODB_CLUSTER_PW: process.env.MONGODB_CLUSTER_PW,
//   // add other environment variables as needed
// };
const config = {
    PORT: process.env.PORT,
    PROJECT_RESOURCES_DIR: process.env.PROJECT_RESOURCES_DIR,
    MONGODB_CLUSTER_PW: process.env.MONGODB_CLUSTER_PW,
    MONGODB_USER: process.env.MONGODB_USER,
    PORT: process.env.PORT || 3000
};
module.exports = config;// needed for the config object