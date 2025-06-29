const mongoose=require("mongoose");
const initData=require("./data.js")
const Listing = require("../Models/listing.js");

main().then((res)=>{
    console.log("app is running")
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({ ...obj,
      owner:'685d0c5d5c5ff3cd431e7e20',
    }))
    await Listing.insertMany(initData.data);
   
}

initDB();