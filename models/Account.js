const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema

const AccountSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  },
  handle: {
    type: String,
    required: true,
    max: 40
  },
  phonenumber: {
    type: String,
    required: true
  },
  addressbuffer: [
    {
      pincode: {
        type: String,
        required: true
      },
      addressline1: {
        type: String,
        required: true
      },
      addressline2: {
        type: String
      },
      addressline3: {
        type: String
      },
      landmark: {
        type: String
      },

      cityname: {
        type: String,
        required: true
      },

      statename: {
        type: String,
        required: true
      }
    }
  ],

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
  ],
  auctionsparticipated: [
    {
      finalbid: {
        type: String,
        required: true
      },
      yourbid: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true
      }
    }
  ]
});

module.exports = Account = mongoose.model("account", AccountSchema);
