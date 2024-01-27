import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  InputGroup,
  Modal,
  Stack,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";
import useAxiosPost from "../hook/useAxiosPost";
import DoubleBtnModal from "../components/Modal/DoubleBtnModal";
import useAxiosDelete from "../hook/useAxiosDelete";

function MyPage() {
  const { myId, myName } = useDecodingJwt();
  const [complaintContent, setComplaintContent] = useState("");
  const [requestData, setRequestData] = useState("");
  const [complaintModalShow, setComplaintModalShow] = useState(false);
  const [logoutModalShow, setLogoutModalShow] = useState(false);
  const [leaveModalShow, setLeaveModalShow] = useState(false);
  const [memberName, setMemberName] = useState("");
  const navigate = useNavigate();

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
  } = useAxiosDelete({ url: `/api/member/${myId}` });
  useEffect(() => {
    if (!isLoadingDel) {
      if (responseDataDel !== null) {
      } else {
      }
    }
  }, [responseDataDel, errorDel, isLoadingDel]);

  const changeMemberName = (e) => {
    setMemberName(e.target.value);
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

  // 이전 페이지로 돌아가기
  const goBack = () => {
    navigate(-1);
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

  // 탈퇴 모달 열기
  const openLeaveModal = () => {
    setLeaveModalShow(true);
  };

  // 탈퇴 모달 닫기
  const closeLeaveModal = () => {
    setLeaveModalShow(false);
  };

  // 탈퇴
  const leave = () => {
    performDelete();
    sessionStorage.removeItem("access-token");
    closeLeaveModal();
    navigate(`/`);
  };

  const complaintIsValid = complaintContent !== "";
  const leaveIsValid = memberName === myName;

  return (
    <>
      <Container>
        <Stack direction="horizontal">
          <div className="p-2" onClick={goBack}>
            {"<"}
          </div>
          <div className="p-2">설정</div>
        </Stack>
        <div onClick={openComplaintModal}>오류 제보</div>
        <hr />
        <div onClick={openLogoutModal}>로그아웃</div>
        <hr />
        <div onClick={openLeaveModal}>탈퇴</div>
      </Container>
      <Modal show={complaintModalShow}>
        <Form onSubmit={submitPost}>
          <Modal.Header>오류 제보</Modal.Header>
          <Modal.Body>
            <p>안녕하세요. 오류를 아래 칸에 간단히 적어주세요.</p>
            <Form.Control
              as="textarea"
              placeholder="내용을 입력하세요."
              rows={5}
              value={complaintContent}
              onChange={changeComplaintContent}
            />
          </Modal.Body>
          <Modal.Footer>
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
            >
              전송
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <DoubleBtnModal
        title={"로그아웃"}
        content={"로그아웃 하시겠습니까?"}
        btnContent1={"취소"}
        btnContent2={"확인"}
        show={logoutModalShow}
        onAction={logout}
        onHide={closeLogoutModal}
      />
      <Modal show={leaveModalShow}>
        <Modal.Header>탈퇴</Modal.Header>
        <Modal.Body>
          <p>더이상 미라클농장을 이용하지 않으시나요?</p>
          <InputGroup>
            <InputGroup.Text>닉네임</InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="닉네임을 입력하세요."
              value={memberName}
              onChange={changeMemberName}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={closeLeaveModal}>
            취소
          </Button>
          <Button type="submit" onClick={leave} disabled={!leaveIsValid}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default MyPage;
