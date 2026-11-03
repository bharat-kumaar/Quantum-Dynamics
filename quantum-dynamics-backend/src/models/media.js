const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
    originalName: { 
        type: String, 
        required: true 
    },
    filename: { 
        type: String, 
        required: true 
    },
    path: { 
        type: String, 
        required: true 
    },
    mimetype: { 
        type: String, 
        required: true 
    },
    size: { 
        type: Number 
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    project: { // Optional relation to Project
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Media', mediaSchema);