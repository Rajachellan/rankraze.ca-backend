const multer=require('multer')

const path=require('path')

const Storage=multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,path.join(process.cwd(),"/smUpload"))
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
}) 
const uploads=multer({storage:Storage})

module.exports=uploads