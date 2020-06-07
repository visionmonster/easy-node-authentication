// load the things we need
const bcrypt   = require('bcrypt-nodejs');
const config = require('../../config/database').mysqlconfig;
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');


class User {
  constructor(props) {
      props = props || {};
      this.id = props.id || undefined;
      this.local = props.local || {};
      this.facebook = props.facebook || {};
      this.twitter = props.twitter || {};
      this.google = props.google || {};
//      this.connection.end();
  }

  validPassword(password){
    return bcrypt.compareSync(password, this.local.password);
  }

  generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  async save(cb) {
    const connection = await mysql.createConnection(config);

    if(!this.id) {
      this.id = uuidv4();
      const newIdQuery = await connection.query('INSERT INTO users (id) VALUES(?)',[this.id]);
    }

    // local
    const local = await connection.query(`
      INSERT INTO local_users
        (email, password, display_name, fk_user)
      VALUES
        (?, ?, ?, (SELECT pk FROM users WHERE id = ?))
      ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        password = VALUES(password),
        display_name = VALUES(display_name)
        `,[this.local.email, this.local.password, this.local.email, this.id]);
    // facebook
    const facebook = await connection.query(`
      INSERT INTO facebook_users
        (id, token, display_name, fk_user)
      VALUES
        (?, ?, ?, (SELECT pk FROM users WHERE id = ?))
      ON DUPLICATE KEY UPDATE
        id = VALUES(id),
        token = VALUES(token),
        display_name = VALUES(display_name)
      `,[this.facebook.id, this.facebook.token, this.facebook.name, this.id]);



    await connection.end();

    return cb();
  }
}


async function findOne(queryObject, cb) {
  const connection = await mysql.createConnection(config);
  const userObject = {
    local: {},
    facebook: {},
    twitter: {},
    google: {}
  };
  console.log('queryobject', queryObject);
  if(queryObject['local.email']){
     const [localUser] = await connection.execute('SELECT email, display_name, password, users.id as user_id FROM local_users, users WHERE `email` = ? and local_users.fk_user = users.pk' , [queryObject['local.email']]);
     userObject.id = localUser[0].user_id;
     userObject.local = {...localUser[0]};
  }
  if(queryObject['facebook.id']){
     const [facebookUser] = await connection.execute('SELECT facebook_users.id, token, display_name, users.id as user_id FROM facebook_users, users WHERE facebook_users.id = ? and facebook_users.fk_user = users.pk' , [queryObject['facebook.id']]);
     userObject.id = facebookUser[0].user_id;
     userObject.facebook = {...facebookUser[0]};
  }

  await connection.end();
  console.log('running findOne', queryObject);
  console.log('userObject', userObject);
  cb(null, userObject.id ? new User(userObject) : null);
}

async function findById(id, cb) {
  console.log('find by ID', id);
  const findConfig = {...config};
  findConfig.multipleStatements = true;
  const connection = await mysql.createConnection(findConfig);

  const userObject = new User({id:id});

  const [localUser] = await connection.execute('SELECT email, display_name, password FROM local_users, users WHERE fk_user = users.pk AND users.id = ?', [id]);
  const [facebookUser] = await connection.execute('SELECT facebook_users.id, token, display_name FROM facebook_users, users WHERE fk_user = users.pk AND users.id = ?', [id]);
  console.log(localUser, facebookUser);

  console.log('findById --> ', {...localUser[0]});
  await connection.end();
  console.log('running findOne', id);
  userObject.local = {...localUser[0]};
  userObject.facebook = {...facebookUser[0]};
  cb(null, userObject);
}

module.exports = {
  User,
  findOne,
  findById
}
