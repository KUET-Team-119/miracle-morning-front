import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function NavigationBar() {
  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container>
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
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
