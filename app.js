const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Routes
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// Start server
app.listen(process.env.PORT || 3000, function(){
    console.log("Server is live...");
});