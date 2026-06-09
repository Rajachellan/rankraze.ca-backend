let mongoose=require('mongoose')

let webPortfolioSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    fields:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
        enum:[
            "Responsive Modern",
            "Custom E-Commerce",
            "Marketing & Learning"
        ]
    }
})

let webPortfolioModel=mongoose.model("websiteportfolio",webPortfolioSchema)

module.exports=webPortfolioModel