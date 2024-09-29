const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
  url_original: {
    type: String
  },
  short_url: {
    type: Number
  }
})

module.exports = mongoose.model('Url', urlSchema)