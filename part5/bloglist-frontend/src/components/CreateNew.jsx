import { useState } from "react";
import { TextField, Button, Box } from "@mui/material";

const CreateNew = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();

    // 1. FRONTEND GUARD: Prevents unnecessary processing/API calls
    if (!title.trim() || !author.trim() || !url.trim()) {
      return;
    }

    try {
      await createBlog({
        title: title,
        author: author,
        url: url,
      });

      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (error) {
      console.error(error);
    } finally {
      //
    }
  };

  return (
    <Box component="form" onSubmit={addBlog} sx={{ maxWidth: 400 }}>
      <h2>Create new blog</h2>
      <TextField
        fullWidth
        label="Title:"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Author:"
        name="author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
        margin="normal"
      />
      <TextField
        fullWidth
        label="Url:"
        name="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        margin="normal"
      />

      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
        Create
      </Button>
    </Box>
  );
};
export default CreateNew;
