import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navigation = ({ user, handleLogout }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  return (
    <AppBar position="static" sx={{ mb: 2 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* DESKTOP LOGO */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BLOG APP
          </Typography>
          {/* MOBILE MENU (Icon + Dropdown) */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem component={Link} to="/" onClick={handleCloseNavMenu}>
                <Typography textAlign="center">BLOGS</Typography>
              </MenuItem>

              {user && (
                <MenuItem
                  component={Link}
                  to="/create"
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">NEW BLOG</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          {/* MOBILE LOGO (Centered) */}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            BLOG APP
          </Typography>
          {/* DESKTOP BUTTONS (Pushed to the right) */}
          <Box sx={{ flexGrow: 1 }} />{" "}
          {/* This spacer pushes content to the right */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
            <Button
              component={Link}
              to="/"
              onClick={handleCloseNavMenu}
              sx={{ color: "white" }}
            >
              blogs
            </Button>
            {user && (
              <Button
                component={Link}
                to="/create"
                onClick={handleCloseNavMenu}
                sx={{ color: "white" }}
              >
                new blog
              </Button>
            )}
          </Box>
          {/* AUTH SECTION */}
          <Box sx={{ ml: 2 }}>
            {user ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography
                  variant="body2"
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  {user.name.toUpperCase()}
                </Typography>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={handleLogout}
                  size="small"
                >
                  logout
                </Button>
              </Box>
            ) : (
              <Button component={Link} to="/login" color="inherit">
                login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
