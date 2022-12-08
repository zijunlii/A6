var express = require("express"); 

var app = express();

var path = require("path"); 

var dataServiceAuth = require(__dirname + "/final.js");

app.use(express.static('public'));

var HTTP_PORT = process.env.PORT || 8080; 

function onHttpStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/finalViews/home.html"));
});

app.get("/home", function(req, res){
    res.sendFile(path.join(__dirname, "/finalViews/home.html"));
});

app.get("/register", function(req, res){
    res.sendFile(path.join(__dirname, "/finalViews/register.html"));
});

app.post("/register", (req,res) => {
    dataServiceAuth.registerUser(req.body)
    .then(() => res.sendFile("registered successfully. <a href='/home'> Go Home </a>"))
    .catch (res.sendFile("Error: email or password cannot be empty"))
});

app.get("/signIn", function(req, res){
    res.sendFile(path.join(__dirname, "/finalViews/signIn.html"));
});

app.post("/signIn", (req,res) => {
    dataServiceAuth.checkUser(req.body)
    .then(user => {
        res.send("Signed in successfully. <a href='/home'> Go Home </a> ");
    })
    .catch(err => {
        res.send("Not Found")
    }) 
});

app.use((req, res) => {
    res.status(404).end('404 PAGE NOT FOUND');
});

dataServiceAuth.initialize()
.then(function(){     
    app.listen(HTTP_PORT, function(){         
        console.log("app listening on: " + HTTP_PORT)     
    }); 
}).catch(function(err){     
    console.log("unable to start server: " + err); 
});