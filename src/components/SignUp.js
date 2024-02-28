import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAxiosPost from "../hook/useAxiosPost";
import { Button, Card, Form, Image, InputGroup, Modal } from "react-bootstrap";
import styles from "../css/SignUp.module.css";
import logoIcon from "../images/logo.png";

function SignUp({ setIsMember }) {
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [requestData, setRequestData] = useState("");
  const [successModalShow, setSuccessModalShow] = useState(false);
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const navigate = useNavigate();

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
    setIsClicked(true);
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
        setIsClicked(false);
        const status = error.response.status;
        if (status === 401) {
          setErrorModalShow(true);
        } else if (status === 403) {
          setErrorModalShow(true);
        } else if (status === 404) {
          setErrorModalShow(true);
        } else if (status === 409) {
          setErrorModalShow(true);
        } else {
          navigate("/server-error");
        }
      }
    }
  }, [responseData, error, isLoading]);

  // 닉네임, 비밀번호 유효성 검사
  const isValid = name !== "" && pw !== "" && !isClicked;

  // 로그인 화면으로 이동
  const goToEnter = () => {
    setSuccessModalShow(false); // 모달 닫기
    setIsMember();
  };

  return (
    <div className={styles.container}>
      <Image className={styles.logo} src={logoIcon} alt="로고" rounded />
      <h1 className={styles.title}>
        나를 키우는 공간
        <br />
        미라클 농장🌱
      </h1>
      <Card className={styles.infoCard}>
        <Card.Body>
          <Card.Text className={styles.cardContent}>
            비밀번호 만들기를 누르면
            <br />
            자동으로 안전한 비밀번호가 생성돼요
          </Card.Text>
          <Card.Text className={styles.cardWarning}>
            ※ 생성된 비밀번호는 변경이 불가해요
            <br />
            반드시 캡처 후 보관해주세요
          </Card.Text>
        </Card.Body>
      </Card>
      <Form className={styles.form} onSubmit={submitPost}>
        <InputGroup className={styles.inputGroup}>
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
        <InputGroup className={styles.inputGroup}>
          <Button
            className={styles.pwBtn}
            type="button"
            onClick={generatePassword}
            disabled={pw !== "" ? true : false}
          >
            {pw !== "" ? "생성 완료" : "비밀번호 만들기"}
          </Button>
          <Form.Control type="text" value={pw} readOnly />
        </InputGroup>
        <Button
          className={styles.submitBtn}
          type="submit"
          disabled={isValid ? false : true}
          onClick={objToJson}
        >
          회원가입
        </Button>
      </Form>
      <Button
        className={styles.loginBtn}
        type="button"
        variant="link"
        onClick={setIsMember}
      >
        로그인 화면으로 돌아가기
      </Button>
      <Modal show={successModalShow} centered>
        <Modal.Body className={styles.modalBody}>
          <p className={styles.modalBodyTitle}>✅ 회원가입 신청 완료</p>
          <p className={styles.modalBodyContent}>
            관리자 승인 완료 후 이용이 가능합니다
          </p>
          <Button
            className={styles.modalBtn}
            variant="primary"
            onClick={goToEnter}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
      <Modal show={errorModalShow} centered>
        <Modal.Body className={styles.modalBody}>
          <p className={styles.modalBodyTitle}>⛔ 중복된 닉네임입니다</p>
          <p className={styles.modalBodyContent}>다른 닉네임을 입력해주세요</p>
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

SignUp.propTypes = {
  setIsMember: PropTypes.func.isRequired,
};

export default SignUp;
