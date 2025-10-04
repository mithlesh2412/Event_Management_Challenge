const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Routes
app.get("/", function(req, res){
    res.render("home");
});

app.get("/attendee-itinerary", function(req, res){
    res.render("attendees");
});

app.get("/organizer-dashboard", function(req, res){
    res.render("dashboard");
});
app.get("/sponsor-portal", function(req, res){
    res.render("sponsors");
});
app.get("/vendor-coordination", function(req, res){
    res.render("vendors");
});

// Start server
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is live...");
});