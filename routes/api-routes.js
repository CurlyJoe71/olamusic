// Database configuration
var mongojs = require("mongojs");
var databaseUrl = "ola_music_planner";
var collections = ["planner", "library"];
var moment = require("moment");

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

module.exports = function (app) {

  app.get("/", function (req, res) {
    res.render("planner/home");
  });

  app.get("/all/planner", function (req, res) {
    db.planner.find({}, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("I got the data");
        res.json(data);
        // res.render("last", data);
      }
    });
  });

  app.post("/all/planner/search", function (req, res) {
    let request = req.body;
    console.log(request);
    console.log(req.body[0]);

    db.planner.findOne({request}, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("I got the data");
        res.json(data);
        // res.render("last", data);
      }
    });
  });

  app.get("/all/library", function (req, res) {
    db.library.find({}, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(data);
      };
    });
  });

  app.put("/search/library/composer", function (req, res) {
    console.log("Got search/library request");
    console.log(req.body);
    let reqBody = Object.keys(req.body);
    console.log(reqBody[0]);

    db.library.update({}, { $set: { "render": false } }, { multi: true }, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {

        db.library.update({ "composer": reqBody[0] }, { $set: { "render": true } }, function (err, data) {
          if (err) {
            console.log(err);
          }
          else {
            console.log("finished query");
            console.log(data);
            res.send("got it");
          }
        })
      };
    });
  });

  app.put("/search/library/title", function (req, res) {
    console.log("Got search/library request");
    console.log(req.body);
    let reqBody = Object.keys(req.body);
    console.log(reqBody[0]);

    db.library.update({}, { $set: { "render": false } }, { multi: true }, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {

        db.library.update({ "title": reqBody[0] }, { $set: { "render": true } }, function (err, data) {
          if (err) {
            console.log(err);
          }
          else {
            console.log("finished query");
            console.log(data);
            res.send("got it");
          }
        })
      };
    });
  });

  app.get("/library", function (req, res) {

    db.library.find({}, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        let obj = {
          data: data
        }
        res.render("planner/library", obj);
      };
    });
  });

  app.get("/reset/library", function (req, res) {

    db.library.update({}, { $set: { "render": true } }, { multi: true }, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {

        db.library.find({}, function (err, data) {
          if (err) {
            console.log(err);
          }
          else {
            let obj = {
              data: data
            };

            res.render("planner/library", obj);
          }
        })
      };
    });
  });

  app.get("/library/:id", function (req, res) {
    let ObjectId = require("mongodb").ObjectId;
    let id = req.params.id;
    // gonderi_id;
    let o_id = new ObjectId(id);

    console.log(id);
    db.library.find({ "_id": o_id }, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        console.log(data[0]);
        res.render("planner/library_edit", data[0]);
      }
    });
  });

  app.put("/update/library/:id", function (req, res) {
    let ObjectId = require("mongodb").ObjectId;
    let id = req.params.id;
    let o_id = new ObjectId(id);
    console.log("this is the id");
    console.log(id);
    const reqBody = req.body;
    console.log("this is the req.body");
    console.log(reqBody);

    db.library.update({ "_id": o_id }, req.body, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("updated the library entry for this request");
        let obj = {
          data
        }
        res.send(obj);
      };
    });
  });

  app.get("/add/library", function (req, res) {
    res.render("planner/library_add");
  });

  app.post("/add/library/new", function (req, res) {
    db.library.insert(req.body, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("added to the library");
        res.json(data);
      };
    });
  });

  app.get("/planner", function (req, res) {

    db.planner.find({}, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("I got the data");

        for (let i = 0; i < data.length; i ++) {
          data[i].caldate = moment(data[i].caldate, "MMDDYYYY").format("MMMM Do, YYYY");
        };
        let obj = {
          data
        };
        console.log(data);
        console.log(obj);
        // res.json(data);
        res.render("planner/planner_home", obj)

      };
    });
  });








};