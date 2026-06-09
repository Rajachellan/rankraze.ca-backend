const mongoose=require('mongoose')


const schema=new mongoose.Schema({
    socialmediaportfolioimage:{
        type:String,
        required:true
    },
    socialmediaportfoliocategory:{
        type:String,
        required:true,
        enum:[
            "Education",
            "Healthcare",
            "Food",
            "Beauty",
            "Gardening",
            "Realestate",
            "Clothing",
            "Logistics",
            "IT",
            "Ecommerce",
            "Bilingual",
            "Branding",
            "Product",
            "Salon",
            "Warehouse",
            "Others"
        ]
    }
})

let model=mongoose.model("socialMediaPortfolio",schema)

module.exports=model