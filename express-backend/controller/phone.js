const { ObjectId } = require('mongodb')
const Phone = require('../models/Phone')

const getList = async () => {
  const list = await Phone.find()
  return list
}

const getSoldOutList = async () => {
  const list = await Phone.find({stock: {$gt: 0}, disabled: {$ne: true} }).sort({stock: 1}).limit(5)
  return list
}

const getBestSellerList = async () => {
  const list = await Phone.aggregate([
    { $match: { 
      disabled: { $ne: true },
      'reviews.2': { $exists: true }}
    },
    { $unwind: "$reviews" },
    { $group: {
      _id: "$_id",
      brand: { $first: "$brand"},
      image: { $first: "$image"},
      averageRating: { $avg: "$reviews.rating"}
    }},
    { $sort: { averageRating: -1 } },
    { $limit: 5 },
    { $project: {
      _id: 1,
      brand: 1,
      image: 1,
      averageRating: 1
    }}
  ])
  return list
}

const getSearchResult = async(keyword) => {
  const list = await Phone.find({title: {$regex: keyword, $options: "i"}, disabled: { $ne: true}})
  return list
  
}

const getPhoneDetail = async(id) => {
  const phone_id = id;
  const objectId = new ObjectId(phone_id)
  const list = await Phone.find({ _id: objectId })
  return list
}

const getPhoneByBrand = async(brand) => {
  const list = await Phone.find({ brand: brand })
  return list
}

const getPhoneByMaxPrice = async(price) => {
  const list = await Phone.find({ price: { $lte: price } })
  return list
}

const addReview = async(_id, review) => {
  const phone_id = _id;
  const objectId = new ObjectId(phone_id)
  // const list = await Phone.updateOne({ _id: objectId }, { $push: { reviews: review }});
  const res = await Phone.updateOne({ _id: objectId }, { $push: { reviews: { $each: [review], $position: 0 } } });
  return res;
}

const phoneDisable = async(_id, value) => {

  const res = await Phone.updateOne({
    "_id": new ObjectId(_id)
  },{
    $set : { disabled: value }
  })
  return res;
}

const reviewHidden = async(phoneID, reviewID, hidden, ) => {
  const res = await Phone.updateOne(
    { "_id": new ObjectId(phoneID), "reviews.reviewer": reviewID},
    { "$set": { "reviews.$.hidden": hidden } }
  );
  return res;
}

module.exports = {
  getList,
  getSoldOutList,
  getBestSellerList,
  getSearchResult,
  getPhoneDetail,
  getPhoneByBrand,
  getPhoneByMaxPrice,
  addReview,
  phoneDisable,
  reviewHidden
}

/**
 * getList: get total list
 * getSoldOutList: get sold out soon phones
 * getBestSellerList: get best sellers
 * getSearchResult: search for keyword
 * getPhoneDetail: get phone detail by id
 * getPhoneByBrand: get phone list by brand
 * getPhoneByMaxPrice: get phone list by max price
 */
