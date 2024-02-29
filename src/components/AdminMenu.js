import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Col, Modal, Nav, Offcanvas, Row } from "react-bootstrap";
import styles from "../css/AdminMenu.module.css";

function AdminMenu({ show, onHide }) {
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const goToMemberManaging = () => {
    if (pathname === `/admin/member-managing`) {
      onHide();
    } else {
      navigate(`/admin/member-managing`);
    }
  };

  const goToImages = () => {
    if (pathname === `/admin/images`) {
      onHide();
    } else {
      navigate(`/admin/images`);
    }
  };

  const goToStatistics = () => {
    if (pathname === `/admin/statistics`) {
      onHide();
    } else {
      navigate(`/admin/statistics`);
    }
  };

  const goToCompalints = () => {
    if (pathname === `/admin/complaints`) {
      onHide();
    } else {
      navigate(`/admin/complaints`);
    }
  };

  const goToSetting = () => {
    if (pathname === `/admin/setting`) {
      onHide();
    } else {
      navigate(`/admin/setting`);
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
                <Nav.Link className={styles.link} onClick={goToMemberManaging}>
                  사용자 관리
                </Nav.Link>
              </Row>
              <Row>
                <Nav.Link className={styles.link} onClick={goToImages}>
                  사진 관리
                </Nav.Link>
              </Row>
              <Row>
                <Nav.Link className={styles.link} onClick={goToStatistics}>
                  통계 관리
                </Nav.Link>
              </Row>
              <Row>
                <Nav.Link className={styles.link} onClick={goToCompalints}>
                  오류 관리
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
