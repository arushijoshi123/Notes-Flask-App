"use client";
import { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  Box,
  Container,
  LinearProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignUp() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for progress bar
  const [message, setMessage] = useState(""); // Message to display
  const [showMessage, setShowMessage] = useState(false); // Control visibility of message
  const router = useRouter();

  const handleSignUp = async () => {
    const userData = {
      userName,
      password,
    };

    setLoading(true); // Show progress bar

    try {
      const response = await axios.post(
        "https://flask-note-backend.onrender.com/signUp",
        userData
      );

      if (response.status === 200) {
        // Show success message
        setMessage("Signup successful! Redirecting to login...");
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false); // Hide message after 2 seconds
          router.push("/login");
        }, 2000);
      } else {
        // Show error message
        setMessage(response.data.message || "Signup failed");
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false); // Hide message after 2 seconds
        }, 2000);
      }
    } catch (error) {
      // Show error message
      setMessage("An error occurred: " + error.message);
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false); // Hide message after 2 seconds
      }, 2000);
    } finally {
      setLoading(false); // Hide progress bar when request completes
    }
  };

  return (
    <Box
      sx={{
        background: "rgb(0, 163, 164)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={5}
          sx={{
            padding: 4,
            borderRadius: 3,
            boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.85)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "#333",
              fontWeight: "bold",
              textAlign: "center",
              fontFamily: "Dancing Script",
            }}
          >
            User SignUp page
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#555", textAlign: "center", marginBottom: 2 }}
          >
            Register your account to start taking notes!
          </Typography>

          {/* Progress Bar (Visible during loading) */}
          {loading && <LinearProgress sx={{ my: 2 }} />}

          <Box component="form" mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSignUp}
                  sx={{
                    padding: 1.5,
                    borderRadius: 2,
                    backgroundColor: "#2575fc",
                    "&:hover": { backgroundColor: "#6a11cb" },
                    color: "#fff",
                    fontWeight: "bold",
                    textTransform: "none",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  }}
                  disabled={loading} // Disable button while loading
                >
                  Sign Up
                </Button>
              </Grid>

              {/* Toast Message (Visible below Sign Up button) */}
              {showMessage && (
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: message.includes("successful") ? "green" : "red",
                      textAlign: "center",
                      marginTop: 2,
                    }}
                  >
                    {message}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
