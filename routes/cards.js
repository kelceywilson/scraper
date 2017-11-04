const express = require('express');

const router = express.Router();
const { data } = require('../data/flashCardData.json');

const { cards } = data;
// console.log(cards);
// vv this path doesn't need to be '/cards' because every route will start with cards
// already. see the app.js  try this ^ tho...

router.get('/', (req, res) => {
  const randomCard = Math.floor(Math.random() * cards.length);
  res.redirect(`/cards/${randomCard}?side=question`);
});

// use query string - e.g. ?side=question
router.get('/:id', (req, res) => {
  let { side } = req.query;
  const { id } = req.params;
  if (!side) {
    side = 'question';
  }
  const name = req.cookies.username;
  const text = cards[id][side];
  // console.log(text);
  const { hint } = cards[id];
  const templateData = {
    id, text, name, side,
  };

  if (side === 'question') {
    templateData.hint = hint;
    templateData.sideToShow = 'answer';
    templateData.sideToShowDisplay = 'Answer';
  } else {
    templateData.sideToShow = 'question';
    templateData.sideToShowDisplay = 'Question';
  }
  res.render('card', templateData);
  // res.render('cards', {
  //   prompt: cards[req.params.id].question,
  //   hint: cards[req.params.id].hint,
  // });
});


module.exports = router;
// i guess it doesn't matter what variable module.exports exports to as long as it
// is named something else when it's required by filename
