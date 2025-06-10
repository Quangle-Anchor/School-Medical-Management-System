import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Image,
  Container,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/img/logoxoanen.png";

const navigation = [
  { name: "Dashboard", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Calendar", href: "/calendar" },
];

export default function AppNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginState = async () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("role");
      if (!token || !storedRole) {
        setIsLoggedIn(false);
        return;
      }
      try {
        await axios.get("/api/auth/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsLoggedIn(true);
        setRole(storedRole);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
      }
    };
    checkLoginState();
  }, []);

  useEffect(() => {
    if (!role) return;
    switch (role) {
      case "Manager":
        navigate("/managerDashboard");
        break;
      case "Admin":
        navigate("/adminDashboard");
        break;
      case "Nurse":
        navigate("/nurseDashboard");
        break;
      case "Parent":
        navigate("/parentDashboard");
        break;
      case "Student":
        navigate("/studentDashboard");
        break;
      default:
        navigate("/");
    }
  }, [role, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" bg="primary" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <Image src={logo} height={40} alt="Logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {navigation.map((item) => (
              <Nav.Link
                key={item.name}
                as={NavLink}
                to={item.href}
                end
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                {item.name}
              </Nav.Link>
            ))}
          </Nav>
          <Nav className="ms-auto align-items-center">
            {!isLoggedIn ? (
              <Button variant="light" onClick={() => navigate("/login")}>
                Login
              </Button>
            ) : (
              <NavDropdown
                title={
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                    roundedCircle
                    height={30}
                    width={30}
                    alt="User"
                  />
                }
                id="user-nav-dropdown"
                align="end"
              >
                <NavDropdown.Item onClick={handleLogout}>
                  Sign out
                </NavDropdown.Item>
              </NavDropdown>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
