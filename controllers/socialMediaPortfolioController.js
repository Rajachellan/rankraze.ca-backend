
const socialMediaPortfolioModel=require('../models/socialMediaPortfolioSchema.js')

const fs=require('fs')

const path=require('path')

// ADD
async function addSocialMediaPortfolio(req,res) {
    const {socialmediaportfolioimage,socialmediaportfoliocategory}=req.body
    try{

        const file=req.file.filename


        if(!file){
            return res.status(400).json({
                success:false,
                message:"Image is Required"
            })
        }

        if(!socialmediaportfoliocategory){
          const imagepath= path.join(
                __dirname,
                '../smUpload',
                file)
            
            if(fs.existsSync(imagepath)){
                fs.unlinkSync(imagepath)
            }
            return res.status(400).json({
                success:false,
                message:"Please Provide Valuable Input"
            })
        }

        const addData=new socialMediaPortfolioModel({socialmediaportfolioimage:file,socialmediaportfoliocategory})
        await addData.save()
        res.status(200).json({
            success:true,
            message:"Data Added"
        })
    }
    catch(err){
        // IF ANY UNEXPECTED ERROR COMES DELETING IMAGE
        if(req.file){

            const imagePath = path.join(
                __dirname,
                '../smUpload',
                req.file.filename
            )

            if(fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath)
            }
        }
        res.status(500).json({
            success:false,
            message:`ErrorName:${err.name} ErrorMessage:${err.message}`
        })
    }
}

//GET
async function getSocialMediaPortfolio(req,res) {
    try{
        const getData=await socialMediaPortfolioModel.find()
        res.status(200).json({
            success:true,
            message:"Data Geted",
            Data:getData
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:`ErrorName:${err.name} ErrorMessage:${err.message}`
        })
    }
}

//UPDATE
async function updateSocialMediaPortfolio(req,res) {
    const {socialmediaportfolioimage,socialmediaportfoliocategory}=req.body 
    try{

        const existingData=await socialMediaPortfolioModel.findById(req.params.id)
        if(!existingData){
            return res.status(400).json({
                success:false,
                message:"Data Not Found"
            })
        }

        const oldImage=existingData.socialmediaportfolioimage

        let updateImage=oldImage

        

        //NEW IMAGE
        if(req.file){
            updateImage=req.file.filename
        }

        //UPDATE DB
        await socialMediaPortfolioModel.findByIdAndUpdate(req.params.id,{socialmediaportfoliocategory,socialmediaportfolioimage:updateImage},
        {new:true})
        res.status(201).json({
            success:true,
            message:"Data Updated"
        })

        //DELETING OLD IMAGE IF RESPONSE BECOME TRUE

         if(req.file){
        const oldImagePath = path.join(
                __dirname,
                '../smUpload',
                oldImage
            )
        if(fs.existsSync(oldImagePath)){
                fs.unlinkSync(oldImagePath)
            }
            }
    }
    catch(err){
          if(req.file){
                const oldImagePath = path.join(
                __dirname,
                '../smUpload',
                oldImage
            )
             if(fs.existsSync(oldImagePath)){
                fs.unlinkSync(oldImagePath)
            }
                    }
        res.status(500).json({
            success:false,
            message:`ErrorName:${err.name} ErrorMessage:${err.message}`
        })
    }
}

//DELETE
async function deleteSocialMediaPortfolio(req,res) {
    try{

        const existingData=await socialMediaPortfolioModel.findById(req.params.id)

        if(!existingData){
            return res.status(400).json({
                success:false,
                message:"Data Not Found"
            })
        }

          // IMAGE PATH
        const imagePath = path.join(
            __dirname,
            '../smUpload',
            existingData.socialmediaportfolioimage
        )

        // DELETE IMAGE
        if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath)
        }


        await socialMediaPortfolioModel.findByIdAndDelete(req.params.id)
        res.status(201).json({
            success:true,
            message:"Deleted Successfully"
        })
    }
    catch(err){
          if(req.file){
        const newImagePath = path.join(
                    __dirname,
                    '../smUpload',
                    req.file.filename
                )
        
                if(fs.existsSync(newImagePath)){
                    fs.unlinkSync(newImagePath)
                }
            }
        res.status(500).json({
            success:false,
            message:`ErrorName:${err.name} ErrorMessage:${err.message}`
        })
    }
}

module.exports={addSocialMediaPortfolio,getSocialMediaPortfolio,updateSocialMediaPortfolio,deleteSocialMediaPortfolio}