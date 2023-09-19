const mongooes = require('../database/mongo')

const PhoneSchema = mongooes.Schema({
  title:{
    type: String,
    required: true
  },
  brand:{
    type: String,
    required: true
  },
  image:{
    type: String,
    required: true
  },
  stock:{
    type: Number,
    required: true
  },
  seller:{
    type: String,
    required: true
  },
  price:{
    type: Number,
    required: true
  },
  reviews:{
    type: Array,
    required: true
  },
  disabled:{
    type: Boolean,
    requiered: true
  }
}, { timestamps: true})

const Phone = mongooes.model('PhoneList', PhoneSchema,'PhoneList')
module.exports = Phone