const express = require("express");

const app = express();
app.use(express.static("public"));

// Routes
app.get('/', (req, res) => {
    res.render("index");
});

// Start server
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is live...");
});