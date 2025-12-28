const mongoose = require('mongoose')

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled Document',
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
    }],
    content: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Document', DocumentSchema)