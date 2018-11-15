const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const key = require("../../config/keys");
const passport = require("passport");

//Load Input Validation
const validateAddressbufferInput = require("../../validation/addressbuffer");
const validateAccountInput = require("../../validation/account");

//Load Account Model
const Account = require("../../models/Account");

//Load User Model
const User = require("../../models/User");

//@route GET api/accounts/test
//@desc  Tests account route
//@access Public
router.get("/test", (req, res) => res.json({ msg: "Account Works" }));

//@route GET api/accounts
//@desc  Get current users account
//@access Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Account.findOne({ user: req.user.id })
      .then(account => {
        if (!account) {
          errors.noaccount = "There is no account for this user";
          return res.status(404).json(errors);
        }
        return res.json(account);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route GET api/accounts/all
//@desc  Get all accounts
//@access Public

router.get("/all", (req, res) => {
  const errors = {};

  Account.find()
    .populate("user", ["name", "avatar"])
    .then(accounts => {
      if (!accounts) {
        errors.noaccount = "There are no accounts";
        return res.status(404).json(errors);
      }

      res.json(accounts);
    })
    .catch(err => res.status(404).json({ account: "there are no profiles" }));
});

//@route GET api/accounts/handle/:handle
//@desc  Get Account by handle
//@access Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};

  Account.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(account => {
      if (!account) {
        errors.noaccount = "there is no account for this user";
        res.status(404).json(errors);
      }

      res.json(account);
    })
    .catch(err => res.status(404).json(err));
});
//@route GET api/accounts/user/:user_id
//@desc  Get Account by user ID
//@access Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};

  Account.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(account => {
      if (!account) {
        errors.noaccount = "there is no account for this user";
        res.status(404).json(errors);
      }

      res.json(account);
    })
    .catch(err =>
      res.status(404).json({ account: "there is no account for this user" })
    );
});

//@route POST api/accounts
//@desc  Create or edit User Account
//@access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAccountInput(req.body);

    //Check Validation
    if (!isValid) {
      //Return any errors with 400 status
      return res.status(400).json(errors);
    }
    //Get fields
    const accountFields = {};
    accountFields.user = req.user.id;
    if (req.body.handle) accountFields.handle = req.body.handle;
    if (req.body.phonenumber) accountFields.phonenumber = req.body.phonenumber;

    Account.findOne({ user: req.user.id }).then(account => {
      if (account) {
        //Update
        Account.findOneAndUpdate(
          { user: req.user.id },
          { $set: accountFields },
          { new: true }
        ).then(account => res.json(account));
      } else {
        //Check if handle exists
        Account.findOne({ handle: accountFields.handle }).then(account => {
          if (account) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }

          //Save Account
          new Account(accountFields).save().then(account => res.json(account));
        });
      }
    });
  }
);

//@route POST api/accounts/addressbuffer
//@desc  Add address in Account
//@access Private

router.post(
  "/addressbuffer",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateAddressbufferInput(req.body);

    //Check Validation
    if (!isValid) {
      //Return  any errors with 400 status
      return res.status(400).json(errors);
    }
    Account.findOne({ user: req.user.id }).then(account => {
      const newAddress = {
        pincode: req.body.pincode,
        addressline1: req.body.addressline1,
        addressline2: req.body.addressline2,
        addressline3: req.body.addressline3,
        landmark: req.body.landmark,

        //..............cityname & statename to be added.......................//
        //it's temporary
        cityname: req.body.cityname,
        statename: req.body.statename
      };
      //Add to addressbuffer array
      account.addressbuffer.unshift(newAddress);

      account.save().then(account => res.json(account));
    });
  }
);

//@route POST api/accounts/bidding/:biddingproduct_id
//@desc  Make a bid
//@access Private

router.post(
  "/bidding/:biddingproduct_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Account.findOne({ user: req.user.id }).then(account => {
      const newBid = {
        bidamount: req.body.bidamount
      };
      const addbid = account.bid.indexOf(req.params.biddingproduct_id);

      //add bid
      account.bid.unshift(newbid);
      //save
      account.save().then(account => res.json(account));
    });
  }
);

//@route DELETE api/accounts/addressbuffer/addressbuffer_id
//@desc  Delete address from account
//@access Private
router.delete(
  "/addressbuffer/:addressbuffer_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Account.findOne({ user: req.user.id })
      .then(account => {
        //Get remove index
        const removeIndex = account.addressbuffer
          .map(item => item.id)
          .indexOf(req.params.addressbuffer_id);

        //Splice out of array
        account.addressbuffer.splice(removeIndex, 1);

        //save
        account.save().then(account => res.json(account));
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route DELETE api/accounts
//@desc  Delete user and account
//@access Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Account.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
