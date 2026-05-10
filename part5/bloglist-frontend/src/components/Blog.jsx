import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Divider,
  Chip,
} from "@mui/material";

// Standard icon imports
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import LaunchIcon from "@mui/icons-material/Launch";
import PersonIcon from "@mui/icons-material/Person";

const Blog = ({ blogs, handleLike, handleDelete, user }) => {
  const { id } = useParams();

  if (!blogs || blogs.length === 0) return null;

  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return (
      <Typography
        variant="h6"
        color="error"
        sx={{ mt: 4, textAlign: "center" }}
      >
        Blog not found
      </Typography>
    );
  }

  const showRemoveButton =
    blog.user && user && blog.user.username === user.username;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5, px: 2 }}>
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          borderRadius: 3,
          boxShadow: 6,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="div"
            sx={{ fontWeight: "bold", mb: 1 }}
          >
            {blog.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
            <Chip
              icon={<PersonIcon />}
              label={`By ${blog.author}`}
              variant="outlined"
              color="primary"
              size="small"
            />
          </Box>

          <Typography
            variant="body1"
            sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}
          >
            <strong>URL:</strong>
            <Button
              href={blog.url}
              target="_blank"
              rel="noreferrer"
              size="small"
              endIcon={<LaunchIcon />}
              sx={{ textTransform: "none", p: 0, minWidth: 0 }}
            >
              Visit Source
            </Button>
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 3, mb: 4, fontStyle: "italic", color: "text.secondary" }}
          >
            Added by {blog.user?.name || "Anonymous User"}
          </Typography>

          {/* Centered Engagement Section */}
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                bgcolor: "#f8f9fa", // Light neutral background for balance
                py: 1.5,
                px: 3,
                borderRadius: 3,
                width: "fit-content", // Grows as the number of likes increases
                boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <Typography variant="body1" sx={{ color: "text.primary" }}>
                Likes: <strong>{blog.likes}</strong>
              </Typography>

              {user && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<FavoriteIcon sx={{ fontSize: 18 }} />}
                  onClick={() => handleLike(blog)}
                  color="primary" // Balanced with your Blue Nav Bar
                  sx={{
                    borderRadius: 5,
                    textTransform: "lowercase",
                    fontWeight: "bold",
                    px: 2,
                  }}
                >
                  like
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>

        {showRemoveButton && (
          <CardActions sx={{ justifyContent: "flex-end", pb: 2, pr: 2 }}>
            <Button
              variant="text"
              color="error"
              size="small"
              startIcon={<DeleteIcon />}
              onClick={() => handleDelete(blog)}
              sx={{ fontSize: "0.75rem", opacity: 0.7 }}
            >
              Delete Post
            </Button>
          </CardActions>
        )}
      </Card>
    </Box>
  );
};

export default Blog;
