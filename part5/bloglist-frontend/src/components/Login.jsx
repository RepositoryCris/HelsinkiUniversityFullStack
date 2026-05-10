import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const Login = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (event) => {
    event.preventDefault();
    // Pass the local state back to the App's login handler
    handleLogin({ username, password });
  };

  return (
    <Box component="form" onSubmit={onSubmit} sx={{ maxWidth: 300 }}>
      <h2>Log in to application</h2>
      <TextField
        fullWidth
        label="Username"
        value={username}
        onChange={({ target }) => setUsername(target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={({ target }) => setPassword(target.value)}
        margin="normal"
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Login
      </Button>
    </Box>
  );
};

export default Login;
