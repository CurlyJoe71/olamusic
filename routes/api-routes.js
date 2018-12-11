// Database configuration
var mongojs = require("mongojs");
var databaseUrl = "ola_music_planner";
var collections = ["planner", "library"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

module.exports = function (app) {

  app.get("/all", function (req, res) {
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

  app.put("/search/library", function (req, res) {
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

        db.library.find({}, function(err, data) {
          if (err) {
            console.log(err);
          }
          else {
            let obj = {
              data:data
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

  app.get("/home", function (req, res) {

    db.library.update({}, { $set: { "render": true } }, { multi: true }, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {

        // db.planner.find({}, function (err, data) {
        //   if (err) {
        //     console.log(err);
        //   }
        //   else {
        //     console.log("I got the data");
        //     let obj = {
        //       caldate: data[0].caldate,
        //       season: data[0].season,
        //       litdate: data[0].litdate,
        //       cycle: data[0].cycle,
        //       opening: data[0].opening.title,
        //       opening_composer: data[0].opening.composer,
        //       prep: data[0].prep.title,
        //       prep_composer: data[0].prep.composer,
        //       communion1: data[0].communion1.title,
        //       communion1_composer: data[0].communion1.composer,
        //       communion2: data[0].communion2.title,
        //       communion2_composer: data[0].communion2.composer,
        //       closing: data[0].closing.title,
        //       closing_composer: data[0].closing.composer
        //     };
        //     console.log(data);
        //     console.log(obj);
        //     // res.json(data);

        //     db.library.find({ "title": obj.opening }, function (err, data) {
        //       if (err) {
        //         console.log(err);
        //       }
        //       else {
        //         obj.opening_lyrics = {
        //           refrain: data[0].refrain,
        //           verses: data[0].verses
        //         };
        //       };

        res.render("planner/last");

        //     })
        //   };
        // });
      };
    });
  });








};