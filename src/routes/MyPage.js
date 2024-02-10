import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Modal,
  Stack,
  Toast,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";
import useAxiosPost from "../hook/useAxiosPost";
import useAxiosDelete from "../hook/useAxiosDelete";
import Menu from "../components/Offcanvas";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";

function MyPage() {
  const { myId, myName } = useDecodingJwt();
  const [complaintContent, setComplaintContent] = useState("");
  const [requestData, setRequestData] = useState("");
  const [complaintModalShow, setComplaintModalShow] = useState(false);
  const [logoutModalShow, setLogoutModalShow] = useState(false);
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
      <Menu
        show={menuShow}
        onHide={() => {
          setMenuShow(false);
        }}
      />
      <Stack gap={1}>
        <Container
          className="d-flex justify-content-center align-items-start"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          <div>
            <p style={{ padding: 0, margin: 0 }}>⚙️ 설정</p>
          </div>
          <img
            className="ms-auto"
            src={homeIcon}
            onClick={goToHome}
            alt="홈"
            style={{ width: 24, height: 24, marginRight: 12 }}
          ></img>
          <img
            src={menuIcon}
            onClick={() => {
              setMenuShow(true);
            }}
            alt="메뉴"
            style={{ width: 24, marginRight: 12 }}
          ></img>
        </Container>
        <Container
          style={{
            borderRadius: "12px",
            borderStyle: "solid",
            borderWidth: "1px",
            borderColor: "#8EC952",
            padding: "16px",
          }}
        >
          <Card
            className="d-flex justify-content-center"
            onClick={openComplaintModal}
            style={{
              height: 48,
              marginBottom: "10px",
              borderColor: "#8ec952",
              backgroundColor: "#e4f6d2",
              padding: 12,
              cursor: "pointer",
            }}
          >
            오류 제보
          </Card>
          <Card
            className="d-flex justify-content-center"
            onClick={openLogoutModal}
            style={{
              height: 48,
              marginBottom: "10px",
              borderColor: "#8ec952",
              backgroundColor: "#e4f6d2",
              padding: 12,
              cursor: "pointer",
            }}
          >
            로그아웃
          </Card>
        </Container>
        <div className="d-flex justify-content-end">
          <Button
            className="ms-auto"
            variant="link"
            onClick={openLeaveConfirmModal}
            style={{ color: "black" }}
          >
            탈퇴
          </Button>
        </div>
      </Stack>
      <Modal show={complaintModalShow} centered>
        <Form onSubmit={submitPost}>
          <Modal.Body>
            <p style={{ textAlign: "center" }}>아래에 오류를 적어주세요.</p>
            <Form.Control
              as="textarea"
              placeholder="내용을 작성해주세요. (1500자 이내)"
              rows={5}
              value={complaintContent}
              onChange={changeComplaintContent}
              maxLength={1500}
            />
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center align-items-center">
            <Button
              type="button"
              variant="secondary"
              onClick={closeComplaintModal}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={complaintIsValid ? false : true}
              onClick={objToJson}
              style={{
                backgroundColor: "#8EC952",
                borderColor: "#8EC952",
              }}
            >
              전송
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={logoutModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p style={{ textAlign: "center", margin: 0, padding: 0 }}>
            로그아웃 하시겠습니까?
          </p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center align-items-center">
          <Button variant="secondary" onClick={closeLogoutModal}>
            취소
          </Button>
          <Button
            onClick={logout}
            style={{
              backgroundColor: "#8EC952",
              borderColor: "#8EC952",
            }}
          >
            확인
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={leaveModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p>탈퇴</p>
          <p>비밀번호를 확인해주세요.</p>
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
        <Modal.Footer className="d-flex flex-row justify-content-center align-items-center">
          <Button type="button" variant="secondary" onClick={closeLeaveModal}>
            취소
          </Button>
          <Button variant="danger" type="submit" onClick={performDelete}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={leaveConfirmModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p>
            탈퇴 시 관련 데이터는 모두{" "}
            <span style={{ color: "#E26862" }}>삭제</span>됩니다.
          </p>
          <p>탈퇴하시겠습니까?</p>
        </Modal.Body>
        <Modal.Footer className="d-flex flex-row justify-content-center align-items-center">
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
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={errorModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p>⛔ 닉네임/비밀번호를 다시 확인해주세요!</p>
          <p>※ 비밀번호 분실 시, 관리자에게 문의</p>
          <Button
            onClick={() => setErrorModalShow(false)}
            style={{ backgroundColor: "#8EC952", border: "none" }}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
      <Toast
        show={postToastShow}
        onClose={() => setPostToastShow(false)}
        delay={3000}
        autohide
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
        }}
      >
        <Toast.Body>오류 제보가 전송되었습니다.</Toast.Body>
      </Toast>
    </>
  );
}

export default MyPage;
