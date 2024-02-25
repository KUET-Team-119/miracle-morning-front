import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";
import useAxiosPost from "../hook/useAxiosPost";
import useAxiosDelete from "../hook/useAxiosDelete";
import Menu from "../components/Menu";
import { Button, Card, Form, InputGroup, Modal, Toast } from "react-bootstrap";
import styles from "../css/Setting.module.css";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";

function Setting() {
  const { myId, myName } = useDecodingJwt();
  const [complaintContent, setComplaintContent] = useState("");
  const [requestData, setRequestData] = useState("");
  const [complaintModalShow, setComplaintModalShow] = useState(false);
  const [leaveModalShow, setLeaveModalShow] = useState(false);
  const [leaveConfirmModalShow, setLeaveConfirmModalShow] = useState(false);
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [pw, setPw] = useState("");
  const [menuShow, setMenuShow] = useState(false);
  const [postToastShow, setPostToastShow] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate("/home");
  };

  // 데이터 객체를 json 형태로 변환
  const objToJson = () => {
    setRequestData(
      JSON.stringify({
        memberName: myName,
        content: complaintContent,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPost = (e) => {
    e.preventDefault();
    performPost();
  };
  // 오류 제보
  const {
    responseData: responseDataPost,
    error: errorPost,
    isLoading: isLoadingPost,
    performPost,
  } = useAxiosPost({
    url: `/api/complaint`,
    requestData,
  });
  useEffect(() => {
    if (!isLoadingPost) {
      if (responseDataPost !== null) {
        closeComplaintModal();
        setPostToastShow(true);
      } else {
        closeComplaintModal();
      }
    }
  }, [responseDataPost, errorPost, isLoadingPost]);

  // Delete Http 요청
  const {
    responseData: responseDataDel,
    error: errorDel,
    isLoading: isLoadingDel,
    performDelete,
  } = useAxiosDelete({ url: `/api/member/${myId}`, password: pw });
  useEffect(() => {
    if (!isLoadingDel) {
      if (responseDataDel !== null) {
        sessionStorage.removeItem("access-token");
        closeLeaveModal();
        navigate(`/`);
      } else {
        setErrorModalShow(true);
        closeLeaveModal();
      }
    }
  }, [responseDataDel, errorDel, isLoadingDel]);

  const changePw = (e) => {
    setPw(e.target.value);
  };

  // 오류 제보 입력 시 input의 value 변경
  const changeComplaintContent = (e) => {
    setComplaintContent(e.target.value);
  };

  // 오류 제보 모달 열기
  const openComplaintModal = () => {
    setComplaintModalShow(true);
  };

  // 오류 제보 모달 닫기
  const closeComplaintModal = () => {
    setComplaintModalShow(false);
    setComplaintContent("");
  };

  // 탈퇴 확인 모달 열기
  const openLeaveConfirmModal = () => {
    setLeaveConfirmModalShow(true);
  };

  // 탈퇴 확인 모달 열기
  const closeLeaveConfirmModal = () => {
    setLeaveConfirmModalShow(false);
  };

  // 탈퇴 모달 열기
  const openLeaveModal = () => {
    setLeaveModalShow(true);
    setLeaveConfirmModalShow(false);
  };

  // 탈퇴 모달 닫기
  const closeLeaveModal = () => {
    setLeaveModalShow(false);
    setPw("");
  };

  const complaintIsValid = complaintContent !== "";

  return (
    <>
      <div className={styles.container}>
        <Menu
          show={menuShow}
          onHide={() => {
            setMenuShow(false);
          }}
        />
        <div className={styles.header}>
          <div className={styles.intro}>
            <p>⚙️ 설정</p>
          </div>
          <div className={styles.headerIcon}>
            <img src={homeIcon} onClick={goToHome} alt="홈" />
            <img
              src={menuIcon}
              onClick={() => {
                setMenuShow(true);
              }}
              alt="메뉴"
            />
          </div>
        </div>
        <div className={styles.settingContainer}>
          <Card
            body
            className={styles.settingCard}
            onClick={openComplaintModal}
          >
            오류 제보
          </Card>
        </div>
        <div className={styles.leaveContainer}>
          <Button
            className={styles.leaveBtn}
            variant="link"
            onClick={openLeaveConfirmModal}
          >
            탈퇴
          </Button>
        </div>
      </div>
      <Modal show={complaintModalShow} centered>
        <Form onSubmit={submitPost}>
          <Modal.Body className={styles.complaintModalBody}>
            <p className={styles.complaintModalBodyTitle}>
              아래에 오류를 적어주세요.
            </p>
            <Form.Control
              as="textarea"
              placeholder="내용을 작성해주세요. (700자 이내)"
              rows={5}
              value={complaintContent}
              onChange={changeComplaintContent}
              maxLength={700}
            />
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <Button
              type="button"
              variant="secondary"
              onClick={closeComplaintModal}
            >
              취소
            </Button>
            <Button
              className={styles.submitBtn}
              type="submit"
              disabled={complaintIsValid ? false : true}
              onClick={objToJson}
            >
              전송
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={leaveConfirmModalShow} centered>
        <Modal.Body className={styles.leaveModalBody}>
          <p className={styles.leaveModalBodyTitle}>
            탈퇴 시 관련 데이터는 모두{" "}
            <span className={styles.leaveModalNotice}>삭제</span>됩니다.
          </p>
          <p className={styles.leaveModalBodyContent}>탈퇴하시겠습니까?</p>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button
            type="button"
            variant="secondary"
            onClick={closeLeaveConfirmModal}
          >
            취소
          </Button>
          <Button variant="danger" type="submit" onClick={openLeaveModal}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={leaveModalShow} centered>
        <Modal.Body className={styles.leaveModalBody}>
          <p className={styles.leaveModalBodyTitle}>탈퇴</p>
          <p className={styles.leaveModalBodyContent}>비밀번호를 확인합니다.</p>
          <InputGroup>
            <InputGroup.Text>비밀번호</InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={pw}
              onChange={changePw}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button type="button" variant="secondary" onClick={closeLeaveModal}>
            취소
          </Button>
          <Button variant="danger" type="submit" onClick={performDelete}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={errorModalShow} centered>
        <Modal.Body className={styles.errorModalBody}>
          <p className={styles.errorModalBodyTitle}>
            ⛔ 닉네임/비밀번호를 다시 확인해주세요!
          </p>
          <p className={styles.errorModalBodyContent}>
            ※ 비밀번호 분실 시, 관리자에게 문의
          </p>
          <Button
            className={styles.errorModalBtn}
            onClick={() => setErrorModalShow(false)}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
      <Toast
        className={styles.toast}
        show={postToastShow}
        onClose={() => setPostToastShow(false)}
        delay={3000}
        autohide
      >
        <Toast.Body>오류 제보가 전송되었습니다.</Toast.Body>
      </Toast>
    </>
  );
}

export default Setting;
