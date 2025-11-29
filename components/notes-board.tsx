"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Trash2, Check, Plus, Edit2, Save, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function NotesBoard() {
    const [loading, setLoading] = useState(true)
    const [notes, setNotes] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [creating, setCreating] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const { toast } = useToast()

    const fetchNotes = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/notes')
            const data = await response.json()

            if (data.success) {
                setNotes(data.notes)
            }
        } catch (error) {
            console.error("Error fetching notes:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchNotes().finally(() => setLoading(false))
    }, [])

    const createNote = async () => {
        if (!title.trim()) {
            toast({
                title: "Error",
                description: "Title is required",
                variant: "destructive",
            })
            return
        }

        try {
            setCreating(true)
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            })
            const data = await response.json()

            if (data.success) {
                toast({
                    title: "Success",
                    description: "Note created successfully",
                })
                setTitle("")
                setDescription("")
                fetchNotes()
            }
        } catch (error) {
            console.error("Error creating note:", error)
            toast({
                title: "Error",
                description: "Failed to create note",
                variant: "destructive",
            })
        } finally {
            setCreating(false)
        }
    }

    const toggleComplete = async (id: string, completed: boolean) => {
        try {
            setLoading(true)
            const response = await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !completed })
            })

            if (response.ok) {
                fetchNotes().finally(() => setLoading(false))
            }
        } catch (error) {
            console.error("Error updating note:", error)
        }
    }

    const startEdit = (note: any) => {
        setEditingId(note.id)
        setEditTitle(note.title)
        setEditDescription(note.description || "")
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditTitle("")
        setEditDescription("")
    }

    const saveEdit = async (id: string) => {
        if (!editTitle.trim()) {
            toast({
                title: "Error",
                description: "Title is required",
                variant: "destructive",
            })
            return
        }

        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle, description: editDescription })
            })

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Note updated successfully",
                })
                setEditingId(null)
                fetchNotes()
            }
        } catch (error) {
            console.error("Error updating note:", error)
            toast({
                title: "Error",
                description: "Failed to update note",
                variant: "destructive",
            })
        }
    }

    const deleteNote = async (id: string) => {
        try {
            const response = await fetch(`/api/notes/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                toast({
                    title: "Deleted",
                    description: "Note deleted successfully",
                })
                fetchNotes().finally(() => setLoading(false))
            }
        } catch (error) {
            console.error("Error deleting note:", error)
            toast({
                title: "Error",
                description: "Failed to delete note",
                variant: "destructive",
            })
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="page-title">My Notes</h2>
                <Badge variant="outline">{notes.length} notes</Badge>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Note</CardTitle>
                    <CardDescription>Create a new note item</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Input
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <Input
                            placeholder="Description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <Button onClick={createNote} disabled={creating}>
                            {creating ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Note
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Notes</CardTitle>
                    <CardDescription>Your Notes list</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        </div>
                    ) : notes.length > 0 ? (
                        <div className="space-y-2">
                            {notes.map((note: any) => (
                                <div
                                    key={note.id}
                                    className="p-4 border rounded-lg hover:bg-gray-50"
                                >
                                    {editingId === note.id ? (
                                        <div className="space-y-3">
                                            <Input
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                                placeholder="Title"
                                            />
                                            <Input
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                                placeholder="Description"
                                            />
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => saveEdit(note.id)}>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={cancelEdit}>
                                                    <X className="mr-2 h-4 w-4" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => toggleComplete(note.id, note.completed)}
                                                >
                                                    {note.completed ? (
                                                        <Check className="h-4 w-4 text-green-600" />
                                                    ) : (
                                                        <div className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <div className="flex-1">
                                                    <h3 className={`font-medium ${note.completed ? 'line-through text-gray-500' : ''}`}>
                                                        {note.title}
                                                    </h3>
                                                    {note.description && (
                                                        <p className="text-sm text-gray-600">{note.description}</p>
                                                    )}
                                                </div>
                                                {note.completed && (
                                                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                                                        Completed
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => startEdit(note)}
                                                >
                                                    <Edit2 className="h-4 w-4 text-blue-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteNote(note.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-600">
                            <p className="text-lg font-medium mb-2">No notes found</p>
                            <p className="max-w-md mx-auto">
                                Create your first note above!
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
