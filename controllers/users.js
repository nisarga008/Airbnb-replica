const User=require("../Models/user");
const passport=require("passport");

module.exports.signUpForm=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signUpUser=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
    let newUser= new User({username,email});
    let registeredUser=await User.register(newUser,password);
    req.login(registeredUser,(err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
    })
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }

};

module.exports.loginForm=(req,res)=>{
    res.render("users/login.ejs")
};

module.exports.loginUser=(req, res) => {
  req.flash("success", "Welcome back!");
  let redirectUrl=res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
}

module.exports.logoutUser=(req,res)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success","logged you out!");
        res.redirect("/listings")
    })
}