const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Неправильний email').isEmail(),
        check('password', 'Найменша довжина пароля 6 символів')
            .isLength({min:6})
    ],
    async (req, res) => {
    try {
      const errors = validationResult(req)

      if(!errors.isEmpty()) {
          return res.status(400).json({
              errors: errors.array(),
              message: 'Некоректні дані при реєстрації'
          })
      }

      const {email, password} = req.body

      const candidat = await User.findOne({email})

      if(candidat){
        return   res.status(400).json({message: 'Такий email вже зайнятий, введіть інший'})
      }
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({email, password: hashedPassword})
      await user.save()

      res.status(201).json({message: 'Користувач успішно створений'})



    } catch (e) {
        res.status(500).json({message: 'Щось пішло не так, попробуйте ще раз'})
    }
})

// /api/auth/login
router.post(
    '/login',
    [
        check('email', 'Неправильний email').normalizeEmail().isEmail(),
        check('password', 'Введіть пароль').exists()
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req)

            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректні дані при входженні в систему'
                })
            }
            const {email, password} = req.body

            const user = await  User.findOne({ email })

            if (!user) {
                return res.status(400).json({message: 'Користувач не знайдений'})
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                return res.status(400).json({message: 'Невірний пароль, попробуйте ще раз'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                {expiresIn: '1h'}
            )

            res.json({token, userId: user.id})


        } catch (e) {
            res.status(500).json({message: 'Щось пішло не так, попробуйте ще раз'})
        }
})

module.exports = router