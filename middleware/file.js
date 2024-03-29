const multer = require('multer')
const config = require('config')

const storage = multer.diskStorage({

    destination(req, file, cb){
        if (file.fieldname === 'groupImage'){
            cb(null, `./admin/${config.get('imgFolder')}/group`)
        }
        if (file.fieldname === 'avatar'){
            cb(null, `./admin/${config.get('imgFolder')}/avatar`)
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