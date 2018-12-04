// Database configuration
var databaseUrl = "ola_music_planner";
var collections = ["planner"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});

module.exports = function (app) {
  app.get("/", function (req, res) {
    db.planner.find({}, function (err, data) {
      if (err) {
        console.log(err);
      }
      else {

        res.render("last", data);
      }
    })
  })







}