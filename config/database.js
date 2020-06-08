// config/database.js
module.exports = {
//mongodb+srv://root:mg1972b!!mg1972b@cluster0-yluco.mongodb.net/Cluster0?retryWrites=true&w=majority
// looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
//mongodb://root:<password>@cluster0-shard-00-00-yluco.mongodb.net:27017,cluster0-shard-00-01-yluco.mongodb.net:27017,cluster0-shard-00-02-yluco.mongodb.net:27017/<dbname>?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority
  //  'url' : 'mongodb+srv://root:mg1972b!!mg1972b@cluster0-yluco.mongodb.net/colorsteps?retryWrites=true&w=majority'
  'url': process.env.MONGODB_URL,
  'mysqlconfig': {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  }
};
