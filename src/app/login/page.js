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
  IconButton,
  InputAdornment,
  LinearProgress,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AccountCircle,
  Lock,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for progress bar
  const [message, setMessage] = useState(""); // Message to display
  const [showMessage, setShowMessage] = useState(false); // Control visibility of message
  const router = useRouter();

  const handleSignIn = async () => {
    const userData = {
      userName,
      password,
    };

    setLoading(true); // Show progress bar

    try {
      const response = await axios.post(
        "https://flask-note-backend.onrender.com/signIn",
        userData
      );

      if (
        response.status === 200 &&
        response.data.message === "sign in successful"
      ) {
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userName", response.data.userName);

        // Show success message
        setMessage("Sign in successful! Redirecting...");
        setShowMessage(true);

        setTimeout(() => {
          setShowMessage(false); // Hide message after 2 seconds
          router.push("/note");
        }, 2000);
      } else {
        // Show error message
        setMessage(response.data.message || "Login failed");
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

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
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
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "#333",
                fontWeight: "bold",
                fontFamily: "Dancing Script",
              }}
            >
              User Login Page
            </Typography>
            <Typography variant="subtitle1" color="textSecondary" gutterBottom>
              Please enter your credentials to sign in.
            </Typography>
          </Box>

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
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle sx={{ color: "#6a11cb" }} />
                      </InputAdornment>
                    ),
                  }}
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
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "#6a11cb" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
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
                  onClick={handleSignIn}
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
                  Sign In
                </Button>
              </Grid>

              {/* Toast Message (Visible below Sign In button) */}
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
