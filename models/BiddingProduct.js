const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const BiddingProductSchema = new Schema({
  productname: {
    type: String,
    required: true
  },
  bidperiod: {
    type: String,
    required: true
  },
  items: [
    {
      product_itemname: {
        type: String,
        required: true
      },
      info: {
        type: String,
        required: true
      },
      price: {
        type: String,
        required: true
      }
    }
  ],
  startingbidprice: {
    type: String,
    require: true
  }
});

module.exports = BiddingProduct = mongoose.model(
  "biddingproduct",
  BiddingProductSchema
);
