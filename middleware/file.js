const multer = require('multer')

const storage = multer.diskStorage({

    destination(req, file, cb){
        if (file.fieldname === 'imageNews'){
            cb(null, `./admin/public/news`)
        }
        if (file.fieldname === 'imagePort'){
            cb(null, `./admin/public/post`)
        }
        if (file.fieldname === 'groupImage'){
            cb(null, `./admin/public/group`)
        }
        if (file.fieldname === 'avatar'){
            cb(null, `./admin/public/avatar`)
        }
        if (file.fieldname === 'roomImage'){
            cb(null, `./admin/public/room`)
        }
    },

    filename(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg']

const fileFilter = (req, file, cb) => {

    if (allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(null, false)
    }

}

module.exports = multer({storage, fileFilter})