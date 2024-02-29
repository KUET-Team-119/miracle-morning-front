import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Modal, Nav, Offcanvas, Row } from "react-bootstrap";
import styles from "../css/Menu.module.css";

function Menu({ show, onHide }) {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const goToHome = () => {
    if (pathname === `/home`) {
      onHide();
    } else {
      navigate(`/home`);
    }
  };

  const goToManaging = () => {
    if (pathname === `/routines`) {
      onHide();
    } else {
      navigate(`/routines`);
    }
  };

  const goToStatistics = () => {
    if (pathname === `/statistics`) {
      onHide();
    } else {
      navigate(`/statistics`);
    }
  };

  const goToImages = () => {
    if (pathname === `/images`) {
      onHide();
    } else {
      navigate(`/images`);
    }
  };

  const goToSetting = () => {
    if (pathname === `/setting`) {
      onHide();
    } else {
      navigate(`/setting`);
    }
  };

  // 로그아웃 모달 열기
  const openLogoutModal = () => {
    setLogoutModalShow(true);
  };

  // 로그아웃 모달 닫기
  const closeLogoutModal = () => {
    setLogoutModalShow(false);
  };

  const logout = () => {
    localStorage.removeItem("access-token");
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
                <Nav.Link className={styles.link} onClick={goToHome}>
                  홈
                </Nav.Link>
              </Row>
              <Row>
                <Nav.Link className={styles.link} onClick={goToManaging}>
                  루틴 관리
                </Nav.Link>
              </Row>
              <Row>
                <Nav.Link className={styles.link} onClick={goToStatistics}>
                  루틴 현황
                </Nav.Link>
              </Row>
              <Row>
                <Nav.Link className={styles.link} onClick={goToImages}>
                  인증 피드
                </Nav.Link>
              </Row>
              <Row>
                <Nav.Link className={styles.link} onClick={goToSetting}>
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
          <p className={styles.logoutModalBodyTitle}>로그아웃 할까요?</p>
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

export default Menu;
