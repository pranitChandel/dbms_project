const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/keys");
const passport = require("passport");

//Load BiddingProduct Model
const BiddingProduct = require("../../models/BiddingProduct");

//@route GET api/biddingproduct/test
//@desc  Tests biddingpoduct route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "BiddingProduct Works" }));

//@route GET api/biddingproducts/all
//@desc  Get all biddingproducts
//@access Public

router.get("/all", (req, res) => {
  const errors = {};

  BiddingProduct.find()

    .then(biddingproducts => {
      if (!biddingproducts) {
        errors.nobiddingproducts = "There are no biddingproducts";
        return res.status(404).json(errors);
      }

      res.json(biddingproducts);
    })
    .catch(err =>
      res.status(404).json({ biddingproduct: "there are no biddingproducts" })
    );
});

//@route GET api/biddingproducts/biddingproductname/:biddingproductname
//@desc  Get BiddingProduct by biddingproductname
//@access Public

router.get("/biddingproductname/:biddingproductname", (req, res) => {
  const errors = {};

  BiddingProduct.findOne({ productname: req.params.biddingproductname })
    // .populate("user", ["name", "avatar"])
    .then(biddingproduct => {
      if (!biddingproduct) {
        errors.nobiddingproduct =
          "there is no biddingproduct with this product name ";

        res.status(404).json(errors);
      }

      res.json(biddingproduct);
    })
    .catch(err => res.status(404).json(err));
});

//@route GET api/biddingproducts/biddingproduct/:biddingproduct_id
//@desc  Get Account by user ID
//@access Public

router.get("/biddingproduct/:biddingproduct_id", (req, res) => {
  const errors = {};

  BiddingProduct.findOne({ _id: req.params.biddingproduct_id })
    //.populate("user", ["name", "avatar"])
    .then(biddingproduct => {
      if (!biddingproduct) {
        errors.nobiddingproduct = "there is no biddingproduct with this id";
        res.status(404).json(errors);
      }

      res.json(biddingproduct);
    })
    .catch(err =>
      res
        .status(404)
        .json({ biddingproduct: "there is no biddingproduct with this id" })
    );
});

//@route POST api/biddingproducts
//@desc  Create or edit BiddingProducts
//@access Public
router.post("/", (req, res) => {
  BiddingProduct.findOne({ productname: req.body.productname }).then(
    productname => {
      if (productname) {
        errors.productname = "Product name already exists";
        return res.status(400).json(errors);
      } else {
        const newbiddingproduct = new BiddingProduct({
          productname: req.body.productname,
          bidperiod: req.body.bidperiod,
          startingbidprice: req.body.startingbidprice
        });

        newbiddingproduct
          .save()
          .then(newbiddingproduct => res.json(newbiddingproduct))
          .catch(err => console.log(err));
      }
    }
  );
});
//@route POST api/biddingproducts/items/:product_id
//@desc  Add item to biddingproduct
//@access Public
router.post("/items/:product_id", (req, res) => {
  BiddingProduct.findOne({ _id: req.params.product_id })
    .then(biddingproduct => {
      const newitem = {
        product_itemname: req.body.product_itemname,
        info: req.body.info,
        price: req.body.price
      };

      //Add to item array
      biddingproduct.items.unshift(newitem);

      biddingproduct.save().then(biddingproduct => res.json(biddingproduct));
    })
    .catch(err =>
      res.status(404).json({ biddingproduct: "there is no biddingproduct " })
    );
});

//@route DELETE api/biddingproducts/:biddingproduct_id
//@desc  Delete biddingproduct
//@access Public
router.delete(
  "/:biddingproduct_id",
  // passport.authenticate("jwt", { session: false }),
  (req, res) => {
    BiddingProduct.findOneAndRemove({ _id: req.params.biddingproduct_id }).then(
      () =>
        // User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
    );
  }
);

module.exports = router;
