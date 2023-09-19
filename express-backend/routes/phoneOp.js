var express = require('express');
var router = express.Router();
const Phone = require('../models/Phone')
const User = require('../models/User')
const {checkUserByid,checkUser} = require("../controller/user");
const { getUsersList } = require('../controller/phone')

router.get('/phonelist', async (req, res) => {
    const { title, brand, highPrice, lowPrice, id} = req.query
    const user = await checkUserByid(id);
    const userId = user[0]["id"].toString();
    const options = {}
    // if (id) options.id = userId;
    if (id) options.seller = userId
    if (title) options.title = new RegExp(title, 'i')
    if (brand) options.brand = brand
    if (highPrice && lowPrice) options.price = { $gte: Number(lowPrice), $lte: Number(highPrice) }
    try {
        const phonelist = await Phone.find(options)
        if (phonelist.length) {
            for (const phone of phonelist) {
                if (phone.reviews&&phone.reviews.length) {
                    for (const review of phone.reviews) {
                        const user = await User.findOne({ _id: review.reviewer._id })
                        review.reviewer = user ? `${user.firstname} ${user.lastname}` : '未知用户'
                    }
                }
            }
            res.send({ code: 200, data: phonelist, message: 'success' })
        } else {
            res.send({ code: 200, data: [], message: 'success' })
        }
    } catch (error) {
        console.log(error);
        res.send({ code: 600, data: [], message: 'find failed' })
    }
})

router.get('/comments', async (req, res) => {
    const {id} = req.query
    const comments = await Phone.find({
      reviews: {
        $elemMatch: {
          reviewer: id
        }
      }
    });
    const reviewerContents = comments.reduce((accumulator, comment) => {
  const matchedReviews = comment.reviews.filter(review => review.reviewer === id);
  const reviewsWithBrandAndTitle = matchedReviews.map(review => {
    return {
      ...review,
      brand: comment.brand,
      id: comment._id,
      title: comment.title
    };
  });
  return accumulator.concat(reviewsWithBrandAndTitle);
}, []);
    res.send({ code: 200, data: reviewerContents });
})
router.get('/changeComment', async (req, res) => {
    const phoneId = decodeURIComponent(req.query["id"])
    const userId = decodeURIComponent(req.query["reviewer"])
    const comments = await Phone.find({
        _id: phoneId,
      reviews: {
        $elemMatch: {
          reviewer: userId
        }
      }
    });
    const filter = {
      _id: phoneId,
      "reviews.reviewer": userId
    };
    const update = {
      $set: {
        "reviews.$[elem].hidden": !comments[0].reviews.find(review => review.reviewer === userId)?.hidden
      }
    };
    const options = {
      arrayFilters: [{ "elem.reviewer": userId }],
      new: true
    };
    const comment = await Phone.findOneAndUpdate(filter, update, options);
    res.send({ code: 200, data: comment });
})
router.post('/phonelist/add', async (req, res) => {
    try {
      const result = await Phone.create(req.body);
      res.send({ code: 200, data: result, message: 'new phone info has been added' });
    } catch (err) {
      res.send({ code: 601, data: err, message: err.message });
    }
  });

router.post('/phonelist/delete/:id', async (req, res) => {
    // console.log(req.params.id)
    try {
        // console.log(req.params.id)
      const result = await Phone.deleteOne({ _id: req.params.id });
      res.send({ code: 200, data: result, message: 'delete success' });
    } catch (err) {
      res.send({ code: 603, data: err, message: 'delete failed' });
    }
  });

module.exports = router;