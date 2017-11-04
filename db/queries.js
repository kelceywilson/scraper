// const db = require('./client');
// ADD USER
const addUser = 'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id';
db.one(addUser, [req.body.email, req.body.password])
  .then((data) => {
    console.log(data.id);
  })
  .catch((error) => {
    console.log('ERROR:', error);
  });


const list = (callback) => {
  db.query('SELECT search_term FROM tasks', (error, result) => {
    if (error) {
      callback(error);
      db.end();
    } else {
      callback(result.rows);
      db.end();
    }
  });
};

const add = (task, callback) => {
  const text = 'INSERT INTO tasks (task) VALUES($1) RETURNING *';
  db.query(text, [task], (error, result) => {
    if (error) {
      callback(error);
      db.end();
    } else {
      callback(result.rows);
      db.end();
    }
  });
};

const update = (action, id, callback) => {
  const checkTask = 'SELECT * FROM tasks WHERE id=($1)';
  const text = `UPDATE tasks SET ${action}=true WHERE id=($1) RETURNING *`;

  db.query(checkTask, [id], (error, result) => {
    if (error) {
      callback(error);
      db.end();
    } else {
      console.log(result.rowCount);
      if (result.rowCount === 0) {
        // console.log('something');
        // if (result.rows.toString() === '') {
        callback(0);
        db.end();
      } else if (result.rows[0][action] === true) {
        // console.log(result);
        callback(1);
        db.end();
      } else {
        db.query(text, [id], (error, result) => {
          if (error) {
            callback(error);
            db.end();
          } else {
            // console.log(Array.isArray(result.rows));
            callback(result.rows);
            db.end();
          }
        });
      }
      // callback(result.rows);
    }
  });
};

module.exports = {
  list,
  add,
  update,
};
