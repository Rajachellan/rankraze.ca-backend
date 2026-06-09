const websiteSchema=require('../models/websitePortfolioSchema')

const fs=require('fs')

const path=require('path')

// ADD 
async function addWebsitePortfolio(req,res) {
    const {name,fields,category}=req.body
    
    try{

        const file=req.file.filename

        if(!file){
            return res.status(400).json({
                success:false,
                message:"Image is Required"
            })
        }

        if(!fields  || !category){
            const imagepath= path.join(
                           __dirname,
                           '../wbUpload',
                           file)
                       
                       if(fs.existsSync(imagepath)){
                           fs.unlinkSync(imagepath)
                       }
            return res.status(400).json({
                success:false,
                message:"Please Provide Valuable Input"
            })
        }

        const addPortfolio=new websiteSchema({image:file,name,fields,category})
        await addPortfolio.save()
        res.status(201).json({
            success:true,
            message:"Data Added"
        })
    }
    catch(err){
         // IF ANY UNEXPECTED ERROR COMES DELETING IMAGE
        if(req.file){
        
        const imagePath = path.join( __dirname,
        '../wbUpload',req.file.filename)
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



// GET
async function getWebsitePortfolio(req,res) {
    try{
        const getPortfolio= await websiteSchema.find()
        res.status(200).json({
            success:true,
            message:"Portfolio Data Geted",
            Data:getPortfolio
        })
    }
    catch(err){
        res.status(500).json({
            success:false,
            message:`ErrorName:${err.name}
            ErrorMessage:${err.message}`
        })       
    }
}

//UPDATE
async function updateWebsitePortfolio(req,res) {
    const {name,fields,category}=req.body
    try{

        const existingData=await websiteSchema.findById(req.params.id)
        if(!existingData){
            return res.status(400).json({
                success:false,
                message:"Data NoT fOUND"
            })
        }

        const oldImage=existingData.image

        let updateNewImage=oldImage

        //NEW IMAGE
        if(req.file){
            updateNewImage=req.file.filename
        }

        await websiteSchema.findByIdAndUpdate(req.params.id,
        {image:updateNewImage,name,fields,category},{new:true})
        res.status(201).json({
            success:true,
            message:"Updated Successfully"
        })

        //DELETING OLD IMAGE
        if(req.file){
        const oldImagePath = path.join(
        __dirname,
        '../wbUpload',
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
        '../wbUpload',
        oldImage
    )
     if(fs.existsSync(oldImagePath)){
        fs.unlinkSync(oldImagePath)
    }
            }
        res.status(500).json({
            success:false,
            message:`ErrroName:${err.name} ErrroMessage:${err.message}`
        })
    }
}

//DELETE
async function deletePortfolio(req,res) {
    try{

        const existingData=await websiteSchema.findById(req.params.id)

        if(!existingData){
            return res.status(400).json({
                success:false,
                message:"Data not Found"
            })
        }
        const imagePath = path.join(
                    __dirname,
                    '../wbUpload',
                    existingData.image
                )
        
            // DELETE IMAGE
            if(fs.existsSync(imagePath)){
            fs.unlinkSync(imagePath)
                }

        await websiteSchema.findByIdAndDelete(req.params.id)
        res.status(200).json({
            success:true,
            message:"Deleted Successfully"
        })
    }
    catch(err){

    if(req.file){
        const newImagePath = path.join(
            __dirname,
            '../wbUpload',
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
module.exports={addWebsitePortfolio,getWebsitePortfolio,updateWebsitePortfolio,deletePortfolio}