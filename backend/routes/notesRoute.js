const express = require("express");
const {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
} = require("../controllers/notesController");


const router = express.Router();

// Create a new note & Get all notes
router
    .route("/")
    .post(createNote)
    .get(getAllNotes);

// Get, update, or delete a specific note by ID
router
    .route("/:id")
    .get(getNoteById)
    .put(updateNote)
    .delete(deleteNote);

module.exports = router;
