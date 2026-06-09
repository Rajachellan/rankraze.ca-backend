const express=require('express')
const router=express.Router()
const {addSocialMediaPortfolio,getSocialMediaPortfolio,updateSocialMediaPortfolio,deleteSocialMediaPortfolio}=require('../controllers/socialMediaPortfolioController.js')

const upload=require('../middleware/uploadSmImages.js')
//ADD
router.post('/add/socialmediaportfolio',upload.single("socialmediaportfolioimage"),addSocialMediaPortfolio)

//GET
router.get('/get/socialmediaportfolio',getSocialMediaPortfolio)

//UPDATE
router.put('/update/socialMediaPortfolio/:id',upload.single("socialmediaportfolioimage"),updateSocialMediaPortfolio)

//DELETE
router.delete('/delete/socialMediaPortfolio/:id',deleteSocialMediaPortfolio)

module.exports=router