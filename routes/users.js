var express = require("express");
var router = express.Router();
var config = require("../config");
var mongoose = require("mongoose");

const url = config.mongoURI;
const connect = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connect.on("error", function (err) {
  console.log("some error occured", err);
});

connect.once("open", () => {
  console.log("connection succedded");
});

let UserModel = require("../models/user");

router.post("/addUser", (req, res) => {
  var myData = new UserModel(req.body);
  myData
    .save()
    .then((item) => {
      res.send(item);
      console.log("item saved in database");
    })
    .catch((err) => {
      res.status(400).send("unable to save database");
      console.log("some error occured");
    });
});

router.get("/getUser", (req, res) => {
  console.log("the request is", req.query);
  UserModel.aggregate(
    [
      {
        $match: {
          email: req.query.email,
          password: req.query.password,
        },
      },
    ],
    function (err, docs) {
      if (err) {
        console.log("some error occured");
        res.send("Some error occured", err);
      } else {
        console.log(docs);
        res.send({ user: docs });
      }
    }
  );
});

router.get("/getAllUsers", (req, res) => {
  UserModel.find({}, (err, docs) => {
    if (err) {
      res.send(err);
    } else {
      res.send(docs);
    }
  });
});

router.post("/updateData", function (req, res) {
  UserModel.findByIdAndUpdate(
    req.body.id,
    {
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    },
    function (err) {
      if (err) {
        res.send(err);
        return;
      }
      res.send({ data: "Record has been updated" });
    }
  );
});

router.post("/deleteUserById/:id", (req, res, next) => {
  console.log("the id being deleted is", req.params.id);
  UserModel.findByIdAndRemove(
    new mongoose.Types.ObjectId(req.params.id),
    (err, data) => {
      if (err) {
        return res.status(404).json({ err: err });
      }

      res.status(200).json({
        success: true,
        message: `File with ID ${req.params.id} is deleted successfully`,
      });
    }
  );
});

router.post("/removeData", function (req, res, next) {
  UserModel.remove({ _id: req.body.id }, function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send({ data: "Record has been deleted" });
    }
  });
});

router.get("/resetPassword/:email", function (req, res) {
  
  UserModel.find({ email: req.params.email }, function (err, data) {
    if (err) {
      res.send(err);
    } else {
      res.status(200).json({
        success: true,
        data,
      });
    }
  });
});

module.exports = router;
