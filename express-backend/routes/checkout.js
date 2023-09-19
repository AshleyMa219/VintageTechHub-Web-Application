var express = require('express');
var router = express.Router();
const Phone = require('../models/Phone')
const {     getPhoneDetail   } = require('../controller/phone')

   
router.post('/payment', async (req, res) => {
    const { stock, id } = req.body;

    try {
      const phone = await getPhoneDetail(id);
      const remain = parseInt(phone[0].stock) - parseInt(stock)

      if (phone) {
        const myquery = { _id: id };
        const newvalues = {  stock : remain};
        await Phone.updateOne(myquery, newvalues);
        res.send({ code: 200, message: 'Pay success' });
      } else {
        res.status(404).send({ message: 'No such phone' });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });


module.exports = router;