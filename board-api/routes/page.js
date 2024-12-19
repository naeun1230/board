const express = require('express')
const router = express.Router()
const { isLoggedIn } = require('./middlewares')
const { User } = require('../models')

// 내 프로필 조회 localhost:8000/page/profile
router.get('/profile', isLoggedIn, async (req, res) => {
   res.json({
      success: true,
      user: req.user, // 로그인한 사용자 정보
      message: '프로필 정보를 성공적으로 가져왔습니다.',
   })
})

// 특정인 프로필 조회 localhost:8000/page/profile/:id
router.get('/profile/:id', isLoggedIn, async (req, res) => {
   try {
      const userId = req.params.id // 사용자 id
      const user = await User.findOne({
         where: { id: userId },
         attributes: ['id', 'userid', 'createdAt', 'updatedAt'], // 필요한 사용자 정보만 가져옴
      })

      if (!user) {
         return res.status(404).json({
            success: false,
            message: '사용자를 찾을 수 없습니다.',
         })
      }

      res.json({
         success: true,
         user, // 팔로우 관련 데이터 제외하고 사용자 정보만 반환
         message: '프로필 정보를 성공적으로 가져왔습니다.',
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({
         success: false,
         message: '특정 사용자 정보를 불러오는 중 오류가 발생했습니다.',
         error,
      })
   }
})

module.exports = router
