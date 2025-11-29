const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    NoteID:{
        type: String,
        require: true
    },
    title: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date
    },
    tags: [{
        type: String,
        trim: true
    }]
}, { timestamps: true });

module.exports = mongoose.model("Note", NoteSchema);
