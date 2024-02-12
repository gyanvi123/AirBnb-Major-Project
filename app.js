const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema } = require("./schema.js");


//Connect to database
const MONGO_URL = "mongodb://127.0.0.1:27017/traveleasy";


main().then((req,res) => {
    console.log("Connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}



app.get("/",(req,res) => {
    res.send("Hi I am root");   
});


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true})); // to parse the url data from show route
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400,error);
    } else {
        next();
    }
  
}



//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));

  
//New Route
app.get("/listings/new", (req,res) => {
   res.render("listings/new.ejs");
});


//Show Route
app.get("/listings/:id", wrapAsync(async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//Create Route
// app.post("/listings", 
//     validateListing,
//     wrapAsync(async (req,res) => {
//         //Extract the information from form
//         const newListing = new Listing(req.body.listing);
//         //Store it in DB
//         await newListing.save();
//         res.redirect("/listings");
// })
// );

//Create Route
app.post("/listings", 
    validateListing,
    wrapAsync(async (req,res) => {
        //Extract the information from form
     let url = req.body.listing.image;
     let filename = "listing";
     req.body.listing.image ={url,filename};
        const newListing = new Listing(req.body.listing);
        //Store it in DB
        await newListing.save();
        res.redirect("/listings");
})
);


//Edit Route
app.get("/listings/:id/edit",  wrapAsync(async (req,res) => {
    //Extract id and find the listing from db
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));

//Update Route
app.put("/listings/:id", validateListing,
   wrapAsync(async (req,res) =>{
     let { id } = req.params;
     let url = req.body.listing.image;
     let filename = "listing";
     req.body.listing.image ={url,filename};

     await Listing.findByIdAndUpdate(id, {...req.body.listing});
     res.redirect(`/listings/${id}`);
}));


//Delete Route
app.delete("/listings/:id", wrapAsync(async (req,res) => {
    //Extract id and find the listing from db
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

app.all("*", (req,res,next) => {
    next(new ExpressError(404,"Page Not Found1"));
});

// //Defining middleware to handle the error
// app.use((err,req,res,next) => {
//     let { statusCode=500, message="Something went wrong!"} = err;
//     res.status(statusCode).render("listings/error.ejs", {message});
//     // res.status(statusCode).send(message);

// });

app.listen(8080,() => {
    console.log("Server is listening to 8080");
});

