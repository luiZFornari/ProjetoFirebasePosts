import { NavLink, Outlet, useNavigate } from "react-router-dom";
import LogoIfsul from "../imagens/logo512.png";
import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { AccountCircle } from "@mui/icons-material";
import { logout, auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

function MenuPrincipal() {
  const [user] = useAuthState(auth);
  const [anchorElMenuManutencoes, setAnchorElMenuManutencoes] = useState(null);
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleLogOut = () => {
    logout();
    setAnchorElUser(null);
  };

  const handleOpenMenuManutencoes = (event) => {
    setAnchorElMenuManutencoes(event.currentTarget);
  };

  const handleCloseMenuManutencoes = () => {
    setAnchorElMenuManutencoes(null);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#f5f5f5", color: "#333" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Avatar
              sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}
              alt="Logo IFSUL"
              src={LogoIfsul}
            />
            <Typography
              variant="h6"
              component={NavLink}
              to="/"
              sx={{
                display: { xs: "none", md: "flex" },
                mr: 2,
                fontFamily: "Roboto",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Meus Posts
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {user && (
                  <>
                    <MenuItem
                      onClick={handleCloseNavMenu}
                      component={NavLink}
                      to="posts"
                    >
                      Posts
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseNavMenu}
                      component={NavLink}
                      to="comunidades"
                    >
                      Comunidades
                    </MenuItem>
                  </>
                )}
                <MenuItem
                  onClick={handleCloseNavMenu}
                  component={NavLink}
                  to="sobre"
                >
                  Sobre...
                </MenuItem>
              </Menu>
            </Box>

            <Avatar
              sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              alt="Logo IFSUL"
              src={LogoIfsul}
            />
            <Typography
              variant="h5"
              component={NavLink}
              to="/"
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                fontFamily: "Roboto",
                fontWeight: 700,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              Meus Posts
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
              {user && (
                <>
                  <Button
                    onClick={handleOpenMenuManutencoes}
                    sx={{ color: "#333", textTransform: "none" }}
                  >
                    Manutenções
                  </Button>
                  <Menu
                    id="menu-manutencoes"
                    anchorEl={anchorElMenuManutencoes}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    keepMounted
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                    open={Boolean(anchorElMenuManutencoes)}
                    onClose={handleCloseMenuManutencoes}
                  >
                    <MenuItem
                      onClick={handleCloseMenuManutencoes}
                      component={NavLink}
                      to="posts"
                    >
                      Posts
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseMenuManutencoes}
                      component={NavLink}
                      to="comunidades"
                    >
                      Comunidades
                    </MenuItem>
                  </Menu>
                </>
              )}
              <Button
                component={NavLink}
                to="sobre"
                sx={{
                  my: 2,
                  color: "#333",
                  textTransform: "none",
                }}
              >
                Sobre
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Menu do usuário">
                <IconButton onClick={handleOpenUserMenu} color="inherit">
                  <Typography>
                    {user ? `Olá, ${user.displayName}` : "Autenticar"}
                  </Typography>
                  <AccountCircle sx={{ ml: 1 }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {user ? (
                  <MenuItem onClick={handleLogOut}>Efetuar Logout</MenuItem>
                ) : (
                  <MenuItem onClick={() => navigate("/login")}>
                    Efetuar Login
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Outlet />
    </>
  );
}

export default MenuPrincipal;
