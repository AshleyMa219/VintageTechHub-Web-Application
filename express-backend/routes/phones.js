var express = require('express');
var router = express.Router();
const { 
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
 } = require('../controller/phone')

router.get('/list', async function(req, res, next) {
  const result = await getList()
  res.json(result)
});

router.get('/sold', async function(req, res, next) {
  const result = await getSoldOutList()
  res.json(result)
});

router.get('/best', async function(req, res, next) {
  const result = await getBestSellerList()
  res.json(result)
});

router.get('/search', async function(req, res, next) {
  const keyword = req.query.keyword
  const result = await getSearchResult(keyword)
  res.json(result)
});

router.get('/item/:id', async function(req, res, next) {
  const phone_id = req.params.id
  const result = await getPhoneDetail(phone_id)
  res.json(result)
});

router.get('/brand', async function(req, res, next) {
  const brand = req.query.brand;
  const result = await getPhoneByBrand(brand)
  res.json(result)
});

router.get('/price', async function(req, res, next) {
  const price = req.query.price;
  const result = await getPhoneByMaxPrice(price)
  res.json(result)
});

router.post('/review', async function(req, res, next){
  const _id = req.body.params.id;
  const reviewObj = req.body.params.review;
  const result = await addReview(_id, reviewObj)
  res.json(result)
})

router.post('/disable', async function(req, res, next){
  const _id = req.body.params._id;
  const disabled = req.body.params.disabled;
  const result = await phoneDisable(_id, disabled)
  res.json(result)
})

router.post('/hidden', async function(req, res, next){

  const phoneID = req.body.params.phoneID;
  const reviewID = req.body.params.reviewID;
  const hidden = req.body.params.hidden;
  const result = await reviewHidden(phoneID, reviewID, hidden)
  res.json(result)
})

module.exports = router;
