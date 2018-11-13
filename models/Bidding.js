const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BiddingSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  bid: [
    {
      biddingproduct: {
        type: Schema.Types.ObjectId,
        ref: "biddingproduct"
      },
      bidamount: {
        type: String,
        required: true
      },
      biddate: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = Bidding = mongoose.model("bidding", BiddingSchema);
