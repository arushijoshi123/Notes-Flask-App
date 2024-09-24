"use client";
import { useState, useEffect } from "react";
import {
  TextField,
  IconButton,
  List,
  ListItem,
  Card,
  CardContent,
  Typography,
  Grid,
  Alert,
} from "@mui/material";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveRoundedIcon from "@mui/icons-material/Save"; // Import Save icon
import axios from "axios";

const colors = ["#fceb00", "#aaf42c", "#00cdd8", "#BCADF2", "#8DCB4E"]; // Array of colors for notes

export default function Notes() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState("");
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");
  const [editingIndex, setEditingIndex] = useState(-1);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = localStorage.getItem("userId");
      const storedUserName = localStorage.getItem("userName");

      setUserId(storedUserId);
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchNotes = async () => {
        try {
          const response = await axios.get(
            `https://flask-note-backend.onrender.com/note/${userId}`
          );
          const fetchedNotes = response.data.note.map((note) => ({
            _id: note._id,
            text: note.noteTitle,
            desc: note.noteDesc,
            color: colors[Math.floor(Math.random() * colors.length)],
          }));
          setNotes(fetchedNotes);
        } catch (error) {
          console.error("Error fetching notes:", error);
        }
      };

      fetchNotes();
    }
  }, [userId]);

  // Handle note submission (create/edit)
  const handleSubmit = async () => {
    if (editingIndex >= 0) {
      // Update existing note via API
      const noteToUpdate = notes[editingIndex];
      const updatedNote = {
        noteTitle: noteTitle || noteToUpdate.text,
        noteDesc: noteDesc || noteToUpdate.desc,
      };

      try {
        const response = await axios.put(
          `https://flask-note-backend.onrender.com/updateNote/${noteToUpdate._id}`,
          updatedNote
        );

        const result = response.data;
        const newNotes = notes.map((note, index) =>
          index === editingIndex
            ? {
                ...note,
                text: result.noteUpdated.noteTitle,
                desc: result.noteUpdated.noteDesc,
              }
            : note
        );
        setNotes(newNotes);
        setWarningMessage("Note edited successfully!");
        setTimeout(() => setWarningMessage(""), 1000);
        setEditingIndex(-1);
        setNoteTitle(""); // Clear title
        setNoteDesc(""); // Clear description
      } catch (error) {
        console.error("Error updating note:", error);
      }
    } else {
      // Create new note via API
      const note = {
        title: noteTitle,
        desc: noteDesc,
        userId,
      };

      try {
        const response = await axios.post(
          "https://flask-note-backend.onrender.com/addNote",
          note
        );

        const newNote = response.data;
        setNotes([
          ...notes,
          {
            _id: newNote._id,
            text: newNote.noteTitle,
            desc: newNote.noteDesc,
            color: colors[Math.floor(Math.random() * colors.length)],
          },
        ]);
        setSuccessMessage("Note Created Successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        console.error("Error adding note:", error);
      }
      setNoteTitle(""); // Clear title
      setNoteDesc(""); // Clear description
    }
  };

  // Handle edit button click
  const handleEdit = (index) => {
    setNoteTitle(notes[index].text);
    setNoteDesc(notes[index].desc);
    setEditingIndex(index);
  };

  // Handle delete button click
  const handleDelete = async (index) => {
    const noteToDelete = notes[index];
    try {
      const response = await axios.delete(
        `https://flask-note-backend.onrender.com/deleteNote/${noteToDelete._id}`
      );

      if (response.status === 200) {
        setNotes(notes.filter((_, i) => i !== index));
        setErrorMessage("Deleted successfully!");
        setTimeout(() => setErrorMessage(""), 1000);
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <Grid
        container
        style={{
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <Grid
          item
          lg={4}
          style={{
            color: "#EF2565",
            marginTop: "1rem",
            marginBottom: "1rem",
            fontFamily: "Dancing Script",
            fontSize: "20px",
          }}
        >
          <h1>
            Hi <span style={{ color: "#64A2FF" }}>{userName}</span>, Let's Play
            with Notes!
          </h1>
        </Grid>
      </Grid>

      <TextField
        label="Note Title"
        variant="outlined"
        value={noteTitle}
        onChange={(e) => setNoteTitle(e.target.value)}
        style={{ marginBottom: "10px", width: "300px", marginLeft: "20px" }}
      />
      <TextField
        label="Note Description"
        variant="outlined"
        value={noteDesc}
        onChange={(e) => setNoteDesc(e.target.value)}
        style={{ marginBottom: "10px", width: "300px", marginLeft: "20px" }}
      />

      {/* Conditionally render the icon based on editing mode */}
      <IconButton color="primary" onClick={handleSubmit}>
        {editingIndex >= 0 ? (
          <SaveRoundedIcon /> // Save icon when editing
        ) : (
          <AddCircleRoundedIcon /> // Add icon when adding new note
        )}
      </IconButton>

      {successMessage && (
        <Alert severity="success" style={{ margin: "20px 0" }}>
          {successMessage}
        </Alert>
      )}

      {errorMessage && (
        <Alert severity="error" style={{ margin: "20px 0" }}>
          {errorMessage}
        </Alert>
      )}

      {warningMessage && (
        <Alert severity="warning" style={{ margin: "20px 0" }}>
          {warningMessage}
        </Alert>
      )}

      <Grid container spacing={3} style={{ padding: "20px" }}>
        {notes.map((note, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              style={{
                backgroundColor: note.color,
                padding: "15px",
                borderRadius: "8px",
                boxShadow:
                  "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
                position: "relative",
                minHeight: "200px",
              }}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  {note.text}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {note.desc}
                </Typography>
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px", // Position the icons at the bottom
                    right: "10px", // Position the icons at the right
                    display: "flex",
                  }}
                >
                  <IconButton onClick={() => handleEdit(index)}>
                    <EditNoteRoundedIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
