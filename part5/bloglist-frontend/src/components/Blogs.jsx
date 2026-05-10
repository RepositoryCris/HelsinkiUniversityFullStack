import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  styled,
} from "@mui/material";

// Custom styled Link to remove default blue underline
const StyledLink = styled(Link)({
  textDecoration: "none",
  fontWeight: 500,
  color: "#1976d2",
  "&:hover": {
    textDecoration: "underline",
  },
});

const Blogs = ({ blogs }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Explore Blogs
      </Typography>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="blog table">
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                Title
              </TableCell>
              <TableCell
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                Author
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", textTransform: "uppercase" }}
              >
                Engagement
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedBlogs.map((blog) => (
              <TableRow
                key={blog.id}
                hover // Adds a subtle background change on hover
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <StyledLink to={`/blogs/${blog.id}`}>{blog.title}</StyledLink>
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>
                  {blog.author}
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bold", color: "success.main" }}
                  >
                    {blog.likes} Likes
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Blogs;
