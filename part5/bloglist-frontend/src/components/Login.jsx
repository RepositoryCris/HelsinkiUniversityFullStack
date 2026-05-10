import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    // Pass the local state back to the App's login handler
    handleLogin({ username, password });
  };

  return (
    /* OUTER WRAPPER: Centers the entire login card on the screen */
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "70vh", // Positions the form nicely in the upper-middle of the viewport
        px: 2,
      }}
    >
      {/* FORM CONTAINER: Paper provides the shadow and background matching your other views */}
      <Paper
        elevation={6}
        sx={{
          p: 4,
          maxWidth: 400,
          width: "100%",
          borderRadius: 4,
        }}
      >
        <Box component="form" onSubmit={onSubmit}>
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: 3,
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Log in to application
          </Typography>

          <TextField
            fullWidth
            label="Username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            margin="normal"
            variant="outlined"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
