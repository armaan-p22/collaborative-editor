const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// REGISTER ROUTE: POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' })
        }

        const existingUsername = await User.findOne({ username })
        if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()

        const token = jwt.sign(
            { id: savedUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.json({
            token,
            user: {
                id: savedUser._id,
                username: savedUser.username,
                email: savedUser.email
            }
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// LOGIN ROUTE: POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router