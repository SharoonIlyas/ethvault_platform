// Schema reference (structure from noteModel.js)
const createNote = (data) => ({
    NoteID: data.NoteID,
    title: data.title?.trim() || "",
    description: data.description?.trim() || "",
    completed: data.completed || false,
    priority: ['low', 'medium', 'high'].includes(data.priority) ? data.priority : 'medium',
    dueDate: data.dueDate || null,
    tags: data.tags || [],
    createdAt: new Date(),
    updatedAt: new Date()
});

// In-memory storage for notes
const notesStore = new Map();
let noteCounter = 1;

// Create New Note (using schema from noteModel.js)
exports.createNote = async (req, res, next) => {
    const { title, description, completed, priority, dueDate, tags } = req.body;

    if (!title) {
        return res.status(400).json({
            success: false,
            message: "Title is required"
        });
    }

    const id = String(noteCounter++);
    const note = createNote({
        NoteID: id,
        title,
        description,
        completed,
        priority,
        dueDate,
        tags
    });
    note.id = id; // Add id for compatibility

    notesStore.set(id, note);

    res.status(201).json({
        success: true,
        message: "Note created successfully",
        note
    });
};

// Get All Notes
exports.getAllNotes = async (req, res, next) => {
    const notes = Array.from(notesStore.values()).sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
        success: true,
        count: notes.length,
        notes
    });
};

// Get Single Note by ID
exports.getNoteById = async (req, res, next) => {
    const note = notesStore.get(req.params.id);

    if (!note) {
        return res.status(404).json({
            success: false,
            message: "Note not found"
        });
    }

    res.status(200).json({
        success: true,
        note
    });
};

// Update Note
exports.updateNote = async (req, res, next) => {
    const note = notesStore.get(req.params.id);

    if (!note) {
        return res.status(404).json({
            success: false,
            message: "Note not found"
        });
    }

    const updatedNote = {
        ...note,
        ...req.body,
        id: note.id,
        NoteID: note.NoteID,
        createdAt: note.createdAt,
        updatedAt: new Date()
    };

    notesStore.set(req.params.id, updatedNote);

    res.status(200).json({
        success: true,
        message: "Note updated successfully",
        note: updatedNote
    });
};

// Delete Note
exports.deleteNote = async (req, res, next) => {
    const note = notesStore.get(req.params.id);

    if (!note) {
        return res.status(404).json({
            success: false,
            message: "Note not found"
        });
    }

    notesStore.delete(req.params.id);

    res.status(200).json({
        success: true,
        message: "Note deleted successfully"
    });
};