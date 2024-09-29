require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const dns = require('dns');
const url = require('url');
const mongoose = require('mongoose');
const Url = require('./src/models/url.model.js')


mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('Connected!'));

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function (req, res) {
  const bodyUrl = req.body.url
  dns.lookup(url.parse(bodyUrl).hostname, async function (err, address) {
    if (!address) {
      res.json({ error: "invalid url" })
    } else {
      const short_url = Math.floor(Math.random() * 1000)
      const newUrl = await Url.create({ url_original: bodyUrl, short_url: short_url })
      res.json({
        original_url: newUrl.url_original,
        short_url: newUrl.short_url
      })
    }
  })
})
app.get('/api/shorturl/:shorturl', async function (req, res) {
  const short_url = parseInt(req.params.shorturl)
  const url = await Url.findOne({ short_url: short_url })
  res.redirect(url.url_original)
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
