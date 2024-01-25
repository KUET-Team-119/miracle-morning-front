import { Navbar, Nav, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Header() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="md" fixed="top">
      <Navbar.Brand>미라클농장</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to={`/home`}>
            홈
          </Nav.Link>
          <Nav.Link as={Link} to={`/routines`}>
            루틴 관리
          </Nav.Link>
          <Nav.Link as={Link} to={`/statistics`}>
            루틴 현황
          </Nav.Link>
        </Nav>
        <Button variant="secondary">MyPage</Button>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
