import { Col, Nav, Offcanvas, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../css/AdminMenu.module.css";

function AdminMenu({ show, onHide }) {
  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>메뉴</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Nav>
          <Col>
            <Row>
              <Nav.Link
                className={styles.link}
                as={Link}
                to={`/admin/membermanaging`}
              >
                사용자 관리
              </Nav.Link>
            </Row>
            <Row>
              <Nav.Link className={styles.link} as={Link} to={`/admin/images`}>
                사진 관리
              </Nav.Link>
            </Row>
            <Row>
              <Nav.Link
                className={styles.link}
                as={Link}
                to={`/admin/statistics`}
              >
                통계 관리
              </Nav.Link>
            </Row>
            <Row>
              <Nav.Link
                className={styles.link}
                as={Link}
                to={`/admin/complaints`}
              >
                오류 관리
              </Nav.Link>
            </Row>
            <Row>
              <Nav.Link className={styles.link} as={Link} to={`/admin/mypage`}>
                마이페이지
              </Nav.Link>
            </Row>
          </Col>
        </Nav>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default AdminMenu;
