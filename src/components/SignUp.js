import { useEffect, useState } from "react";
import useAxiosPost from "../hook/useAxiosPost";
import {
  Button,
  Card,
  Container,
  Form,
  InputGroup,
  Modal,
  Stack,
} from "react-bootstrap";

function SignUp({ setIsMember }) {
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [requestData, setRequestData] = useState("");
  const [successModalShow, setSuccessModalShow] = useState(false);
  const [errorModalShow, setErrorModalShow] = useState(false);

  // 닉네임 입력 시 input의 value 변경
  const changeMemberName = (e) => {
    setName(e.target.value);
  };

  // 비밀번호 랜덤 생성
  const generatePassword = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz";
    const randomChar = characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
    const randomNum = Math.random().toString().substring(2, 6);
    const randomStr = randomChar + randomNum;
    setPw(randomStr);
  };

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
    url: `/api/auth/member/new`,
    requestData,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setSuccessModalShow(true);
      } else {
        setErrorModalShow(true);
      }
    }
  }, [responseData, error, isLoading]);

  // 닉네임, 비밀번호 유효성 검사
  const isValid = name !== "" && pw !== "";

  // 로그인 화면으로 이동
  const goToEnter = () => {
    setSuccessModalShow(false); // 모달 닫기
    setIsMember();
  };

  return (
    <Container
      className="d-flex flex-column justify-content-center align-items-center"
      style={{ height: "100%" }}
    >
      <div style={{ fontSize: 60, marginBottom: 16 }}>
        <span>🦙</span>
      </div>
      <h5 style={{ marginBottom: 16 }}>회원가입🌱</h5>
      <Card
        className="text-center"
        style={{
          marginBottom: 26,
          background: "#E4F6D2",
          border: "none",
          fontWeight: "bold",
        }}
      >
        <Card.Body>
          <Card.Text>
            비밀번호 만들기를 누르면
            <br />
            자동으로 안전한 비밀번호가 생성돼요
          </Card.Text>
          <Card.Text style={{ color: "#E26862" }}>
            ※ 생성된 비밀번호는 변경이 불가해요.
            <br />
            반드시 캡처 후 보관해주세요.
          </Card.Text>
        </Card.Body>
      </Card>
      <Form onSubmit={submitPost}>
        <Stack gap={3}>
          <InputGroup>
            <InputGroup.Text>🌿</InputGroup.Text>
            <Form.Control
              type="text"
              name="memberName"
              value={name}
              placeholder="사용할 닉네임 (10자 이내)"
              onChange={changeMemberName}
              maxLength={10}
            ></Form.Control>
          </InputGroup>
          <InputGroup>
            <Button
              type="button"
              onClick={generatePassword}
              style={{ backgroundColor: "#8EC952", border: "none" }}
              disabled={pw !== "" ? true : false}
            >
              {pw !== "" ? "생성 완료" : "비밀번호 만들기"}
            </Button>
            <Form.Control type="text" value={pw} readOnly />
          </InputGroup>
          <Button
            type="submit"
            disabled={isValid ? false : true}
            onClick={objToJson}
            style={{ backgroundColor: "#8EC952", border: "none" }}
          >
            회원가입
          </Button>
        </Stack>
      </Form>
      <div style={{ margin: 16 }}></div>
      <Button
        type="button"
        variant="link"
        onClick={setIsMember}
        style={{ fontSize: 12, color: "#8EC952" }}
      >
        로그인 화면으로 돌아가기
      </Button>
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={successModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p>✅ 회원가입 신청 완료</p>
          <p>관리자 승인 완료 후 이용이 가능합니다.</p>
          <Button
            variant="primary"
            onClick={goToEnter}
            style={{ backgroundColor: "#8EC952", border: "none" }}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={errorModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p>⛔ 중복된 닉네임입니다.</p>
          <p>다른 닉네임을 입력해주세요.</p>
          <Button
            variant="primary"
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

export default SignUp;
