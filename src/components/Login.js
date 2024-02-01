/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import SingleBtnModal from "./Modal/SingleBtnModal";
import useAxiosPost from "../hook/useAxiosPost";
import { Button, Container, Form, InputGroup, Stack } from "react-bootstrap";

function Login({ setIsMember }) {
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [requestData, setRequestData] = useState("");
  const [errorModalShow, setErrorModalShow] = useState(false);
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
        setErrorModalShow(true);
      }
    }
  }, [responseData, error, isLoading]);

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center">
      <div>
        <span>Logo</span>
      </div>
      <h4>"미라클 농장에 오신 것을 환영합니다."</h4>
      <Form onSubmit={submitPost}>
        <Stack gap={3}>
          <InputGroup>
            <InputGroup.Text>닉네임</InputGroup.Text>
            <Form.Control
              type="text"
              value={name}
              placeholder="닉네임을 입력하세요."
              onChange={changeMemberName}
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Text>비밀번호</InputGroup.Text>
            <Form.Control
              type="password"
              value={pw}
              placeholder="비밀번호를 입력하세요."
              onChange={changeMemberPw}
            />
          </InputGroup>
          <Button
            type="submit"
            disabled={isValid ? false : true}
            onClick={objToJson}
          >
            로그인
          </Button>
        </Stack>
      </Form>
      <Button type="button" variant="link" onClick={setIsMember}>
        계정을 만들고 싶어요
      </Button>
      <SingleBtnModal
        title={"로그인 실패"}
        content={"아이디 또는 비밀번호를 다시 확인해주세요."}
        btnContent={"확인"}
        show={errorModalShow}
        onHide={() => setErrorModalShow(false)}
      />
    </Container>
  );
}

Login.propTypes = {
  setIsMember: PropTypes.func.isRequired,
};

export default Login;
