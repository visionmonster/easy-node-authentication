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
    console.log('saving this..... --------------------------------------------------->', this);
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
        `,
      [this.local.email, this.local.password, this.local.email, this.id]
    );
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
      `,
      [this.facebook.id, this.facebook.token, this.facebook.displayName, this.id]
    );
    const google = await connection.query(`
      INSERT INTO google_users
        (id, token, display_name, fk_user)
      VALUES
        (?, ?, ?, (SELECT pk FROM users WHERE id = ?))
      ON DUPLICATE KEY UPDATE
        id = VALUES(id),
        token = VALUES(token),
        display_name = VALUES(display_name)
      `,
      [this.google.id, this.google.token, this.google.displayName, this.id]
    );

    await connection.end();

    return cb();
  }

  static async findOne(queryObject, cb) {
    console.log('findone -----------> query object', queryObject);
    const userObject = new User();
    const connection = await mysql.createConnection(config);
    let id
    console.log('queryobject', queryObject);
    if(queryObject['local.email']){
       const [localUser] = await connection.execute('SELECT users.id as user_id FROM local_users, users WHERE `email` = ? and local_users.fk_user = users.pk' , [queryObject['local.email']]);
       id = localUser[0] ? localUser[0].user_id : undefined;
    }

    if(queryObject['facebook.id']){
       const [facebookUser] = await connection.execute('SELECT users.id as user_id FROM facebook_users, users WHERE facebook_users.id = ? and facebook_users.fk_user = users.pk' , [queryObject['facebook.id']]);
       id = facebookUser[0] ? facebookUser[0].user_id : undefined;
    }

    if(queryObject['google.id']){
       const [googleUser] = await connection.execute('SELECT users.id as user_id FROM google_users, users WHERE google_users.id = ? and google_users.fk_user = users.pk' , [queryObject['google.id']]);
       id = googleUser[0] ? googleUser[0].user_id : undefined;
    }

    if(id) {
      userObject.id = id;
      const [localUser] = await connection.execute('SELECT email, display_name as displayName, password FROM local_users, users WHERE fk_user = users.pk AND users.id = ?', [id]);
      const [facebookUser] = await connection.execute('SELECT facebook_users.id, token, display_name as displayName FROM facebook_users, users WHERE fk_user = users.pk AND users.id = ?', [id]);
      const [googleUser] = await connection.execute('SELECT google_users.id, token, display_name as displayName FROM google_users, users WHERE fk_user = users.pk AND users.id = ?', [id]);
      userObject.local = {...localUser[0]};
      userObject.facebook = {...facebookUser[0]};
      userObject.google = {...googleUser[0]};
    }
    await connection.end();

    cb(null, userObject.id ? userObject : null);
  }

  static async findById(id, cb) {
    console.log('find by ID', id);
    const connection = await mysql.createConnection(config);

    const userObject = new User({id:id});

    const [localUser] = await connection.execute('SELECT email, display_name as displayName, password FROM local_users, users WHERE fk_user = users.pk AND users.id = ?', [id]);
    const [facebookUser] = await connection.execute('SELECT facebook_users.id, token, display_name as displayName FROM facebook_users, users WHERE fk_user = users.pk AND users.id = ?', [id]);
    const [googleUser] = await connection.execute('SELECT google_users.id, token, display_name as displayName FROM google_users, users WHERE fk_user = users.pk AND users.id = ?', [id]);
    console.log(localUser, facebookUser, googleUser);


    await connection.end();

    userObject.local = {...localUser[0]};
    userObject.facebook = {...facebookUser[0]};
    userObject.google = {...googleUser[0]};
    cb(null, userObject);
  }

}

module.exports = User;
