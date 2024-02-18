import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAxiosPost from "../hook/useAxiosPost";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import styles from "../css/Login.module.css";
import logoIcon from "../images/temp_logo.png";

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
    <div className={styles.container}>
      <img className={styles.logo} src={logoIcon} alt="로고" />
      <h1 className={styles.title}>
        나를 키우는 공간
        <br />
        미라클농장🌱
      </h1>
      <Form className={styles.form} onSubmit={submitPost}>
        <InputGroup className={styles.inputGroup}>
          <InputGroup.Text>🌿</InputGroup.Text>
          <Form.Control
            type="text"
            value={name}
            placeholder="닉네임"
            onChange={changeMemberName}
          />
        </InputGroup>
        <InputGroup className={styles.inputGroup}>
          <InputGroup.Text>🌿</InputGroup.Text>
          <Form.Control
            type="password"
            value={pw}
            placeholder="비밀번호"
            onChange={changeMemberPw}
          />
        </InputGroup>
        <Button
          className={styles.submitBtn}
          type="submit"
          disabled={isValid ? false : true}
          onClick={objToJson}
        >
          로그인
        </Button>
      </Form>
      <Button
        className={styles.signUpBtn}
        type="button"
        variant="link"
        onClick={setIsMember}
      >
        회원가입
      </Button>
      <Modal show={errorModalShow} centered>
        <Modal.Body className={styles.modalBody}>
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
            className={styles.modalBtn}
            onClick={() => setErrorModalShow(false)}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
}

Login.propTypes = {
  setIsMember: PropTypes.func.isRequired,
};

export default Login;
