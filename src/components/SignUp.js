import { useEffect, useState } from "react";
import SingleBtnModal from "./Modal/SingleBtnModal";
import useAxiosPost from "../hook/useAxiosPost";
import { Button, Container, Form, InputGroup, Stack } from "react-bootstrap";

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
    <Container className="d-flex flex-column justify-content-center align-items-center">
      <div>
        <span>Logo</span>
      </div>
      <h4>"회원가입이 필요하시군요!"</h4>
      <Form onSubmit={submitPost}>
        <Stack gap={3}>
          <InputGroup>
            <InputGroup.Text>닉네임</InputGroup.Text>
            <Form.Control
              type="text"
              name="memberName"
              value={name}
              placeholder="닉네임을 입력하세요."
              onChange={changeMemberName}
            ></Form.Control>
          </InputGroup>
          <InputGroup>
            <Button type="button" onClick={generatePassword}>
              비밀번호 생성
            </Button>
            <Form.Control
              type="text"
              value={pw}
              placeholder="비밀번호 생성을 누르세요."
              readOnly
            />
          </InputGroup>
          <p>안내: 랜덤 비밀번호가 보안이 어쩌구~</p>
          <Button
            type="submit"
            disabled={isValid ? false : true}
            onClick={objToJson}
          >
            회원가입
          </Button>
        </Stack>
      </Form>
      <Button type="button" variant="link" onClick={setIsMember}>
        이미 계정이 있어요
      </Button>
      <SingleBtnModal
        title={"환영합니다."}
        content={"미라클 농장은 이렇게 운영됩니다."}
        btnContent={"확인"}
        show={successModalShow}
        onHide={goToEnter}
      />
      <SingleBtnModal
        title={"회원가입 실패"}
        content={"중복된 닉네임입니다."}
        btnContent={"확인"}
        show={errorModalShow}
        onHide={() => setErrorModalShow(false)}
      />
    </Container>
  );
}

export default SignUp;
