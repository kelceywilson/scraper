const express = require('express');
const db = require('../db/client.js');
const cheerio = require('cheerio');

const router = express.Router();


const $ = cheerio.load('http://www.imdb.com/find?ref_=nv_sr_fn&q=findingnemo&s=all');

// GET home page
router.get('/', (req, res) => {
  res.render('main', { name: req.cookies.username, error: req.cookies.error });
});

// POST login with email & password ??? needs password handler
router.post('/login', (req, res) => {
  console.log(req.body);
  if (req.body.choice === 'login_user') {
    // first need to query database to see if user/password combo EXISTS
    const findUser = 'SELECT * FROM users WHERE email = $1 AND password = $2';
    db.one(findUser, [req.body.email, req.body.password])
      .then((data) => {
        console.log('hello');
        console.log(data);
        // if password is correct, set cookie and redirect to home page
        res.clearCookie('error');
        res.cookie('username', req.body.email);
        res.cookie('id', data.id);
        res.redirect('/');
      })
      .catch((error) => {
      // if user doesn't exist, send the error to the user
        if (error.message === 'No data returned from the query.') {
          res.cookie('error', 'user/password combo does not exist');
        }
        res.redirect('/');
      });
  }
  if (req.body.choice === 'add_user') {
    const addUser = 'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id';
    db.one(addUser, [req.body.email, req.body.password])
      .then((data) => {
        console.log(data.id);
        res.clearCookie('error');
        res.cookie('username', req.body.email);
        res.cookie('id', data.id);

        res.redirect('/');
      })
      .catch((error) => {
        console.log('ERROR:', error);
      });
  }
});

// res.json({
//   response: 'you sent me a POST request',
//   body: req.body,
// });
//
// router.post('/add', (req, res) => {
//   const addUser = 'INSERT INTO users(email, password) VALUES($1, $2) RETURNING id';
//   db.one(addUser, [req.body.email, req.body.password])
//     .then((data) => {
//       console.log(data.id);
//     })
//     .catch((error) => {
//       console.log('ERROR:', error);
//     });
// });
// ), (error, result) => {
// if (error) {
//   callback(error);
//   db.end();
// } else {
//   res.json({
//     response: 'you sent me a POST request',
//     body: req.body,
//   });
// });
// if user doesn't exist, add user
// if user exists, check against password
// if password is wrong give Error


// });

// POST logout
router.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.clearCookie('id');
  res.redirect('/');
});

// POST /questions
router.post('/search', (req, res) => {
  console.log(req.body.searchTerm);
  // this should do the following:
  // do the search
  // log the search term and date into the database
  const searchRequest = 'INSERT INTO searches(search_term, user_id) VALUES($1, $2)';
  db.none(searchRequest, [req.body.searchTerm, req.cookies.id])
    .then(() => {
      console.log('success');
    })
    .then(() => {
      res.render('results', { name: req.cookies.username, error: req.cookies.error });
    })
    .catch((error) => {
      console.log(error);
    });
  // res.json({
  //   response: 'you sent me a POST request',
  //   body: req.body,
  // });
});

// GET /question/:qID
// router.get('/', (req, res) => {
//   res.render('main', { name: req.cookies.username, error: req.cookies.error });
// });
router.get('/history', (req, res) => {
  const getHistory = 'SELECT * FROM searches WHERE user_id = $1';
  db.any(getHistory, [req.cookies.id])
    .then((data) => {
      console.log('hello');
      console.log(data);
      res.render('history', { history: data });
    })
    .catch((error) => {
    // if user doesn't exist, send the error to the user
      if (error.message === 'No data returned from the query.') {
        res.json({
          response: 'error',
          body: error,
        });
      }
      // res.redirect('/');
    });
  //
  // db.any('SELECT * FROM searches', (error, result) => {
  //   .then(() => {
  //     console.log('history');
  //     res.render('results', { name: req.cookies.username, error: req.cookies.error });
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
  // });
  // res.json({
  //   response: `you sent me a GET request for ID ${req.params.qID}`,
  // });
});

// POST /question/:qID/answers
router.post('/:qID/answers', (req, res) => {
  res.json({
    response: 'you sent me a POST request to /answers',
    questionId: req.params.qID,
    body: req.body,
  });
});


// PUT /question/:qID/answers/:aID
router.put('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: 'you sent me a PUT request to /answers',
    questionId: req.params.qID,
    answerId: req.params.aID,
    body: req.body,
  });
});

// DELETE /question/:qID/answers/:aID
router.delete('/:qID/answers/:aID', (req, res) => {
  res.json({
    response: 'you sent me a DELETE request to /answers',
    questionId: req.params.qID,
    answerId: req.params.aID,
    body: req.body,
  });
});

// POST /question/:qID/answers/:aID/vote-up
// POST /question/:qID/answers/:aID/vote-down
//    regex /^up|down$/ determines whether up or down only is there
router.post('/:qID/answers/:aID/vote-:dir', (req, res, next) => {
  if (req.params.dir.search(/^up|down$/) === -1) {
    const err = new Error('Not FOund');
    err.status = 404;
    next(err);
  } else {
    next();
  }
}, (req, res) => {
  res.json({
    response: `you sent me a POST request to /vote-${req.params.dir}`,
    questionId: req.params.qID,
    answerId: req.params.aID,
    vote: req.params.dir,
  });
});

module.exports = router;
