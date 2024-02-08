import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAxiosPost from "../hook/useAxiosPost";
import {
  Button,
  Container,
  Form,
  InputGroup,
  Modal,
  Stack,
} from "react-bootstrap";

function Login({ setIsMember }) {
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [requestData, setRequestData] = useState("");
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  // 닉네임 입력 시 input의 value 변경
  const changeMemberName = (e) => {
    setName(e.target.value);
  };

  // 비밀번호 입력 시 input의 value 변경
  const changeMemberPw = (e) => {
    setPw(e.target.value);
  };

  // 닉네임, 비밀번호 유효성 검사
  const isValid = name !== "" && pw !== "";

  // 닉네임, 비밀번호 담긴 객체를 json 형태로 변환
  const objToJson = () => {
    setRequestData(
      JSON.stringify({
        memberName: name,
        password: pw,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPost = (e) => {
    e.preventDefault();
    performPost();
  };
  const { responseData, error, isLoading, performPost } = useAxiosPost({
    url: `/api/auth/member`,
    requestData,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        sessionStorage.setItem("access-token", responseData.accessToken);
        navigate(`/home`);
      } else {
        setStatus(error.response.status);
        setErrorModalShow(true);
      }
    }
  }, [responseData, error, isLoading]);

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      <div style={{ fontSize: 60, marginBottom: 16 }}>
        <span>🦙</span>
      </div>
      <h5>나를 키우는 공간</h5>
      <h5 style={{ marginBottom: 16 }}>미라클 농장🌱</h5>
      <Form onSubmit={submitPost}>
        <Stack gap={3}>
          <InputGroup>
            <InputGroup.Text>🌿</InputGroup.Text>
            <Form.Control
              type="text"
              value={name}
              placeholder="닉네임"
              onChange={changeMemberName}
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>🌿</InputGroup.Text>
            <Form.Control
              type="password"
              value={pw}
              placeholder="비밀번호"
              onChange={changeMemberPw}
            />
          </InputGroup>
          <Button
            type="submit"
            disabled={isValid ? false : true}
            onClick={objToJson}
            style={{ backgroundColor: "#8EC952", border: "none" }}
          >
            로그인
          </Button>
        </Stack>
      </Form>
      <div style={{ margin: 16 }}></div>
      <Stack
        className="justify-content-center align-items-center"
        direction="horizontal"
      >
        <Button
          type="button"
          variant="link"
          style={{ fontSize: 12, color: "#8EC952" }}
        >
          미라클 농장이 처음이신가요?
        </Button>
        <div
          className="vr"
          style={{ maxBlockSize: 12, alignSelf: "center" }}
        ></div>
        <Button
          type="button"
          variant="link"
          style={{ fontSize: 12, color: "#8EC952" }}
          onClick={setIsMember}
        >
          회원가입
        </Button>
      </Stack>
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={errorModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p>
            {status === 401
              ? "⛔ 닉네임/비밀번호를 다시 확인해주세요!"
              : "⛔ 승인되지 않은 계정입니다."}
          </p>
          <p>
            {status === 401
              ? "※ 비밀번호 분실 시, 관리자에게 문의"
              : "※ 관리자 승인 완료 후 이용 가능합니다."}
          </p>
          <Button
            onClick={() => setErrorModalShow(false)}
            style={{ backgroundColor: "#8EC952", border: "none" }}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

Login.propTypes = {
  setIsMember: PropTypes.func.isRequired,
};

export default Login;
