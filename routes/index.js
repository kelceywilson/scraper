const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  if (req.cookies.username) {
    res.render('index', { name: req.cookies.username });
  // } else {
  //   res.redirect('/hello');
  }
});

// router.get('/hello', (req, res) => {
//   if (req.cookies.username) {
//     res.redirect('/');
//   } else {
//     res.render('hello');
//   }
// });
// router.post('/hello', (req, res) => {
//   // res.json(req.body);
//   res.cookie('username', req.body.username);
//   res.redirect('/');
// });
// router.post('/goodbye', (req, res) => {
//   res.clearCookie('username');
//   res.redirect('/hello');
// });

module.exports = router;
