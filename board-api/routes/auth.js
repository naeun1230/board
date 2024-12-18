const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const { isLoggedIn, isNotLoggedIn } = require('./middlewares')
const User = require('../models/user')

const router = express.Router()

//회원가입 localhost:8000/auth/join
router.post('/join', isNotLoggedIn, async (req, res, next) => {
   const { userid, password } = req.body
   try {
      const exUser = await User.findOne({ where: { userid } })
      if (exUser) {
         return res.status(409).json({
            success: false,
            message: '이미 존재하는 아이디입니다.',
         })
      }
      const hash = await bcrypt.hash(password, 12)

      const newUser = await User.create({
         userid,
         password: hash,
      })

      res.status(201).json({
         success: true,
         message: '회원가입이 완료되었습니다!',
         user: {
            id: newUser.id,
            userid: newUser.userid,
         },
      })
   } catch (error) {
      console.error(error)
      res.status(500).json({
         success: false,
         message: '회원가입 중 오류가 발생했습니다.',
         error,
      })
   }
})

//로그인 localhost:8000/auth/login
router.post('/login', isNotLoggedIn, async (req, res, next) => {
   passport.authenticate('local', (authError, user, info) => {
      if (authError) {
         return res.status(500).json({ success: false, message: '인증 중 오류 발생', error: authError })
      }

      if (!user) {
         return res.status(401).json({
            success: false,
            message: info.message || '로그인 실패',
         })
      }

      req.login(user, (loginError) => {
         if (loginError) {
            return res.status(500).json({ success: false, message: '로그인 중 오류 발생', error: loginError })
         }

         res.json({
            success: true,
            message: '로그인 성공!',
            user: {
               id: user.id,
               userid: user.userid,
            },
         })
      })
   })(req, res, next)
})

//로그아웃 localhost:8000/auth/logout
router.get('/logout', isLoggedIn, async (req, res, next) => {
   req.logout((err) => {
      if (err) {
         console.log(err)
         return res.status(500).json({
            success: false,
            message: '로그아웃 중 오류가 발생했습니다.',
            error: err,
         })
      }

      res.json({
         success: true,
         message: '로그아웃에 성공했습니다',
      })
   })
})

//로그인 상태 확인 localhost:8000/auth/status
router.get('/status', async (req, res, next) => {
   if (req.isAuthenticated()) {
      res.json({
         isAuthenticated: true,
         user: {
            id: req.user.id,
            userid: req.user.userid,
         },
      })
   } else {
      res.json({
         isAuthenticated: false,
      })
   }
})

module.exports = router
