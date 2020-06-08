Facebook requires https callback
[How To Create an HTTPS Server on Localhost using Express](https://medium.com/@nitinpatel_20236/how-to-create-an-https-server-on-localhost-using-express-366435d61f28)

MongoDB will get set up with cluster suitable for this example:
[MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

MySQL 8 was used for this, but should work MySQL 5.7
[Getting Started with MySQL](https://dev.mysql.com/doc/mysql-getting-started/en/)

Google help:
[Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred)

Facebook help:
[Facebook for Developers - Test Apps](https://developers.facebook.com/docs/apps/test-apps/)

You will need to create your own `.env` file based off `example.env` to put your tokens and secrets in.
see [dotenv](https://github.com/motdotla/dotenv#readme) for how that works.

Development was done using [nodemon reload, automatically.](https://nodemon.io/) installed globally `npm install -g nodemon` to start the server with `nodemon --inspect server.js`, but you should be able to just run `node server.js`

you can switch between Mongo DB and MySQL by change with model gets loaded in the `config/passport.js` file.

```
// MONGO USER MODEL
// const User = require('../app/models/mongouser');

// MYSQL USER MODEL
const User = require('../app/models/mysqluser');
```





# Easy Node Authentication

Code for the entire scotch.io tutorial series: Complete Guide to Node Authentication

We will be using Passport to authenticate users locally, with Facebook, Twitter, and Google.

#### Upgraded To Express 4.0
This tutorial has been upgraded to use ExpressJS 4.0. See [the commit](https://github.com/scotch-io/easy-node-authentication/commit/020dea057d5a0664caaeb041b18978237528f9a3) for specific changes.

## Instructions

If you would like to download the code and try it for yourself:

1. Clone the repo: `git clone git@github.com:scotch-io/easy-node-authentication`
2. Install packages: `npm install`
3. Change out the database configuration in config/database.js
4. Change out auth keys in config/auth.js
5. Launch: `node server.js`
6. Visit in your browser at: `http://localhost:8080`

## The Tutorials

- [Getting Started and Local Authentication](http://scotch.io/tutorials/easy-node-authentication-setup-and-local)
- [Facebook](http://scotch.io/tutorials/easy-node-authentication-facebook)
- [Twitter](http://scotch.io/tutorials/easy-node-authentication-twitter)
- [Google](http://scotch.io/tutorials/easy-node-authentication-google)
- [Linking All Accounts Together](http://scotch.io/tutorials/easy-node-authentication-linking-all-accounts-together)
