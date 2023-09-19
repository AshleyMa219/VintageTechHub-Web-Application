const mongooes = require('mongoose')

mongooes.connect('mongodb://127.0.0.1:27017/demo').then((client) => {
  console.log("mongodb connect success!");
}).catch((err) => {
  console.log(err);
})

module.exports = mongooes