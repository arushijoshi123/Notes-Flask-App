"use client";
import { Button, Box, Typography, Container, Grid } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSignUpClick = () => {
    router.push("/signup"); // Navigate to the signup page
  };

  const handleLoginClick = () => {
    router.push("/login"); // Navigate to the login page
  };

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        <Grid container spacing={2} direction="column" alignItems="center">
          <Grid item>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 3,
                fontFamily: "Dancing Script",
                fontSize: "57px",
              }}
            >
              Welcome to Our Notes Application
            </Typography>
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              sx={{
                color: "#f5f5f5",
                textAlign: "center",
                marginBottom: 5,
              }}
            >
              one-stop solution to organize your thoughts and ideas.
            </Typography>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={handleLoginClick}
              sx={{
                backgroundColor: "#fff",
                color: "#6a11cb",
                padding: "12px 24px",
                marginRight: 2,
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
                fontWeight: "bold",
              }}
            >
              User Login
            </Button>
            <Button
              variant="contained"
              onClick={handleSignUpClick}
              sx={{
                backgroundColor: "#fff",
                color: "#6a11cb",
                padding: "12px 24px",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
                fontWeight: "bold",
              }}
            >
              User SignUp
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
