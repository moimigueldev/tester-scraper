const express = require('express'),
  router = express.Router();

router.get('/', (req, res) => {
  console.log('Main url hit');

  res.sendStatus(200);
});

module.exports = router;
