import { useState } from "react";
import { TextField, Button, Box, Typography, Paper } from "@mui/material";

const CreateNew = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();
    if (!title.trim() || !author.trim() || !url.trim()) return;

    try {
      await createBlog({ title, author, url });
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    /* 1. OUTER WRAPPER: Occupies the full width and centers the child */
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, px: 2 }}>
      {/* 2. FORM CONTAINER: Paper adds a subtle background/elevation like your Blog card */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
        }}
      >
        <Box component="form" onSubmit={addBlog}>
          <Typography
            variant="h5"
            sx={{ textAlign: "center", mb: 3, fontWeight: "bold" }}
          >
            Create new blog
          </Typography>

          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            margin="dense"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
            margin="dense"
            variant="outlined"
          />
          <TextField
            fullWidth
            label="URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            margin="dense"
            variant="outlined"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            color="primary"
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: 2,
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Create Blog
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateNew;
