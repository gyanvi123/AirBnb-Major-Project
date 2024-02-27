const express = require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions = {
    secret: 'keyboard cat', //Required .signed cookie use to store the secret
    resave: false,
    saveUninitialized: true,
  };


app.use(session(sessionOptions));
app.use(flash());

app.get("/register", (req,res) => {
    let { name = "anonymous" } = req.query;
    req.session.name = name;
    req.flash("Success", "User registered successsfully!");
    res.redirect("/hello");
});

app.get("/hello", (req,res) => {
    res.send("page.ejs", { name: req.session.name, msg: req.flash("success") });
});








// app.get("/reqcount",(req,res) => {
//     //req.session single session ko track krta hai
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });



//   app.get("/test",(req,res) => {
//     res.send("Test Success");
//   });


app.listen(3000, (req,res) =>{
    console.log(`App is listening to port 3000`);
});