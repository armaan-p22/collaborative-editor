const express = require('express')
const router = express.Router()
const Document = require('../models/Document')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

// check if users logged in
const auth = (req, res, next) => {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).json({message: 'No token, authorization denied'})

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (e) {
        res.status(400).json({message: 'Token is not valid'})
    }
}

// create document
router.post('/create', auth, async (req, res) => {
    try {
        const newDoc = new Document({
            owner: req.user.id,
            title: 'Untitled Document'
        })

        const savedDoc = await newDoc.save()
        res.json(savedDoc)

    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// get users document
router.get('/', auth, async (req, res) => {
    try {
        const docs = await Document.find({
            $or: [
                {owner: req.user.id},
                {collaborators: req.user.id}
            ]
        }).sort({lastAccessed: -1})

        res.json(docs)
    } catch (err) {
        res.status(500).json({message: err.message})
    }
})

// update document title
router.put('/update/:id', auth, async (req, res) => {
    try {
        const { title } = req.body
        
        const doc = await Document.findById(req.params.id)
        
        if (!doc) {
            return res.status(404).json({ message: 'Document not found' })
        }

        if (doc.owner.toString() !== req.user.id && !doc.collaborators.includes(req.user.id)) {
            return res.status(401).json({ message: 'Not authorized to edit this document' })
        }

        doc.title = title || 'Untitled Document'
        doc.lastAccessed = Date.now()
        
        const updatedDoc = await doc.save()
        res.json(updatedDoc)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// share document
router.post('/share/:id', auth, async (req, res) => {
    try {
        const {email} = req.body

        const doc = await Document.findById(req.params.id)
        if (!doc) return res.status(404).json({message: 'Document not found'})

        if (doc.owner.toString() !== req.user.id) {
            return res.status(401).json({message: 'Only the owner can share this document'})
        }

        const userToShare = await User.findOne({email})
        if (!userToShare) {
            return res.status(404).json({message: 'User not found. They must register first.'})
        }

        if (userToShare._id.toString() === req.user.id) {
            return res.status(400).json({message: 'You already own this document'})
        }

        if (doc.collaborators.includes(userToShare._id)) {
            return res.status(400).json({message: 'User is already a collaborator'})
        }

        doc.collaborators.push(userToShare._id)
        await doc.save()

        res.json({message: `Successfully shared with ${userToShare.username}`})

    } catch(err) {
        res.status(500).json({message: err.message})
    }
})

module.exports = router