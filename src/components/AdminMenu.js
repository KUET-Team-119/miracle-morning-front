import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Modal, Nav, Offcanvas, Row } from "react-bootstrap";
import styles from "../css/AdminMenu.module.css";

function AdminMenu({ show, onHide }) {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const navigate = useNavigate();

  // 로그아웃 모달 열기
  const openLogoutModal = () => {
    setLogoutModalShow(true);
  };

  // 로그아웃 모달 닫기
  const closeLogoutModal = () => {
    setLogoutModalShow(false);
  };

  const logout = () => {
    sessionStorage.removeItem("access-token");
    closeLogoutModal();
    navigate(`/`);
  };

  return (
    <>
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
                <Nav.Link
                  className={styles.link}
                  as={Link}
                  to={`/admin/images`}
                >
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
                <Nav.Link
                  className={styles.link}
                  as={Link}
                  to={`/admin/setting`}
                >
                  설정
                </Nav.Link>
              </Row>
              <Row>
                <Nav.Link className={styles.link} onClick={openLogoutModal}>
                  로그아웃
                </Nav.Link>
              </Row>
            </Col>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      <Modal show={logoutModalShow} centered>
        <Modal.Body className={styles.logoutModalBody}>
          <p className={styles.logoutModalBodyTitle}>로그아웃 하시겠습니까?</p>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={closeLogoutModal}>
            취소
          </Button>
          <Button className={styles.logoutBtn} onClick={logout}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AdminMenu;
