const express = require('express')
const router = express.Router()
const Document = require('../models/Document')
const User = require('../models/User')
const jwt = require('jsonwebtoken')

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

module.exports = router