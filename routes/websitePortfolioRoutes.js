const express=require('express')

const router=express.Router()

const {addWebsitePortfolio,getWebsitePortfolio,updateWebsitePortfolio,deletePortfolio}=require('../controllers/websitePortfolioController.js')

const upload=require('../middleware/uploadWbImages.js')

//ADD
router.post('/add/websiteportfolio',upload.single("image"),addWebsitePortfolio)

//GET
router.get('/get/websiteportfolio',getWebsitePortfolio)

//UPDATE
router.put('/update/websiteportfolio/:id',upload.single("image"),updateWebsitePortfolio)

//DELETE
router.delete('/delete/websiteportfolio/:id',deletePortfolio)

module.exports=router