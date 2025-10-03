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

// Start server
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is live...");
});