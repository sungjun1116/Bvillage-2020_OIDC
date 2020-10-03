'use strict';
const express = require('express')
const router = express.Router()

router.post('/', (req, res, next) => {
  const post = req.body;
  // const city = post.city;
  res.send(`성공했다 이자식아: ${post}`);
});

module.exports = router;