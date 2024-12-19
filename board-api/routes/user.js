const express = require('express')
const router = express.Router()

// 사용자 관련 라우터 예시
router.get('/profile', (req, res) => {
   res.json({ message: 'User profile information' })
})

module.exports = router
