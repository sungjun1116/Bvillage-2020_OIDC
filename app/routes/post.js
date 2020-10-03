'use strict';
const express = require('express')
const router = express.Router()

router.post('/', (req, res, next) => {
  const post = req.body;
  // const city = post.city;
  res.redirect(`/city/America - Los_Angeles`);
});

module.exports = router;