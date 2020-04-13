const express = require('express')
const app = express()
const port = 4000
const compression = require('compression')
const helmet = require('helmet')
const bodyParser = require('body-parser')
const indexRouter = require('./routes/index')
const cityRouter = require('./routes/city')
const exchangeRouter = require('./routes/exchange')
const communityRouter = require('./routes/community')

// Using static file service
app.use(express.static('public'))

// Using middleware
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(helmet())

// Router
app.use('/', indexRouter);
app.use('/city', cityRouter);
app.use('/exchange', exchangeRouter);
app.use('/community', communityRouter);


// Error Handling
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Not exist')
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
