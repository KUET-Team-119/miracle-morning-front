import styles from "../css/SignUp.module.css";
import { useState } from "react";
import Modal from "react-modal";
import axios from "axios";

function SignUp({ setIsMember }) {
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [post, setPost] = useState("");
  const [successModalSwitch, setSuccessModalSwitch] = useState(false);
  const [errorModalSwitch, setErrorModalSwitch] = useState(false);

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
  const transformToJson = () => {
    setPost(
      JSON.stringify({
        memberName: name,
        password: pw,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPost = (e) => {
    e.preventDefault();
    postData();
  };
  const postData = async () => {
    try {
      const response = await axios.post(`/api/member`, post, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      setSuccessModalSwitch(true);
    } catch (error) {
      console.error(error);
      setErrorModalSwitch(true);
    }
  };

  // 닉네임, 비밀번호 유효성 검사
  const isValid = name !== "" && pw !== "";

  // 로그인 화면으로 이동
  const goToEnter = () => {
    setSuccessModalSwitch(false); // 모달 닫기
    setIsMember();
  };

  // 에러 모달 닫기
  const reTry = () => {
    setErrorModalSwitch(false); // 모달 닫기
  };

  // 모달 스타일 정의
  const customModalStyles = {
    overlay: {
      backgroundColor: " rgba(0, 0, 0, 0.4)",
      width: "100%",
      height: "100vh",
      zIndex: "10",
      position: "fixed",
      top: "0",
      left: "0",
    },
    content: {
      width: "400px",
      height: "240px",
      zIndex: "150",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      borderRadius: "10px",
      boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.25)",
      backgroundColor: "white",
      justifyContent: "center",
      overflow: "auto",
    },
  };

  return (
    <div>
      <div className={styles.signUpContainer}>
        <div className={styles.logoSpace}>
          <span>Logo</span>
        </div>
        <h4>"회원가입이 필요하시군요!"</h4>
        <form className={styles.signUpBox} onSubmit={submitPost}>
          <input
            type="text"
            name="memberName"
            value={name}
            placeholder="닉네임을 입력하세요."
            onChange={changeMemberName}
          ></input>
          <div className={styles.pwContainer}>
            <input
              type="text"
              name="password"
              value={pw}
              placeholder="비밀번호 생성을 누르세요."
              readOnly
            ></input>
            <button
              type="button"
              id="generatePassword"
              onClick={generatePassword}
            >
              비밀번호 생성
            </button>
          </div>
          <p>안내: 랜덤 비밀번호가 보안이 어쩌구~</p>
          <button
            type="submit"
            className={styles.signUpBtn}
            disabled={isValid ? false : true}
            onClick={transformToJson}
          >
            회원가입
          </button>
        </form>
        <button
          type="button"
          className={styles.switchBtn}
          onClick={setIsMember}
        >
          이미 계정이 있어요
        </button>
        <Modal isOpen={successModalSwitch} style={customModalStyles}>
          <h3>안내문</h3>
          <p>환영, 미라클농장 운영 방식, 관리자 승인 후 이용 가능</p>
          <p>미라클농장과 함께 하고 싶다면? 참여방법</p>
          <button className={styles.modalBtn} onClick={goToEnter}>
            닫기
          </button>
        </Modal>
        <Modal isOpen={errorModalSwitch} style={customModalStyles}>
          <h3>안내문</h3>
          <p>가입 불가!</p>
          <p>중복된 닉네임입니다.</p>
          <button className={styles.modalBtn} onClick={reTry}>
            닫기
          </button>
        </Modal>
      </div>
    </div>
  );
}

export default SignUp;
