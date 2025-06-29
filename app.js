if(process.env.NODE_ENV!="production"){
require("dotenv").config();
}
const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const methodOverride=require("method-override")
const ejsMate=require('ejs-mate');
const reviews=require("./routes/reviews.js")
const usersRouter=require("./routes/user.js")
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./Models/user.js");
const listingsRoutes = require("./routes/listing.js");
const { error } = require("console");


app.use(methodOverride('_method'))
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"))
app.use(express.static(path.join(__dirname,"public")))
app.engine('ejs', ejsMate);

const dbUrl=process.env.ATLASDB_URL
main().then((res)=>{
    console.log("app is running")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

const store= MongoStore.create({ 
  mongoUrl:dbUrl,
  crypto: {
    secret:process.env.SECRET
  },
   touchAfter: 24 * 3600   //in seconds
 })

 store.on('error', function (err) {
  console.log('SESSION STORE ERROR', err);
});

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    // expiry date in miliseconds
    expire: Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    //httpOnly is for security purpose prevent from cross scipting attacks
    httpOnly:true,
  }
}





app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
  next();
});


// app.get("/",(req,res)=>{
//     res.send("Lets start with major project")
// })

app.listen("8080",()=>{
    console.log("app is listening on port 8080");
})


app.use("/", usersRouter); //  Apply login/signup routes first
app.use("/listings", listingsRoutes); // Then use the protected routes
app.use("/listings/:id/reviews", reviews);



app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something went wrong"}=err;
  res.status(500).render("error.ejs",{err})
})


// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"abc@gmail.com",
//     username:"abc",

//   })
//  let res11= await User.register(fakeUser,"abc123");
//  res.send(res11);
// })

// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"Page Not Found"));
// })

// app.use((err,req,res,next)=>{
//  res.send("You have entered invalid data please enter correctly");
// })