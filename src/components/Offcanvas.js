import { Col, Nav, Offcanvas, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../css/Offcanvas.module.css";

function Menu({ show, onHide }) {
  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>메뉴</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav>
          <Col>
            <Row>
              <Nav.Link className={styles.link} as={Link} to={`/home`}>
                홈
              </Nav.Link>
            </Row>
            <Row>
              <Nav.Link className={styles.link} as={Link} to={`/routines`}>
                루틴 관리
              </Nav.Link>
            </Row>
            <Row>
              <Nav.Link className={styles.link} as={Link} to={`/statistics`}>
                루틴 현황
              </Nav.Link>
            </Row>
            <Row>
              <Nav.Link className={styles.link} as={Link} to={`/mypage`}>
                마이페이지
              </Nav.Link>
            </Row>
          </Col>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Menu;
