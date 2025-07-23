const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const { createSupportTicket, getAllSupportRequests, deleteSupportRequest } = require('../controllers/supportController')

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

router.post('/support', upload.single('screenshot'), createSupportTicket)
router.get('/support-getAll',getAllSupportRequests)
router.delete('/support/:id',deleteSupportRequest)

router.get('/support', (req, res) => {
  res.send('Support API работает')
})

module.exports = router
