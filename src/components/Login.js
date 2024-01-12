import styles from "../css/Login.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";

function Login({ setIsMember }) {
  const [name, setName] = useState("");
  const [pw, setPw] = useState("");
  const [post, setPost] = useState("");
  const [errorModalSwitch, setErrorModalSwitch] = useState(false);

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
      const response = await axios.post(`/api/member/login`, post, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      const memberName = response.data.memberName;
      goToHome(memberName);
    } catch (error) {
      // To-do 배포 시 반드시 삭제!!!, 로그인이 안되는 이유가 닉네임 때문인지 비밀번호 때문인지 유출
      console.error(error);
      setErrorModalSwitch(true);
    }
  };

  // 로그인 성공 시 홈 화면으로 이동
  const navigate = useNavigate();
  const goToHome = (memberName) => {
    navigate(`/home/${memberName}`);
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
      <div className={styles.loginContainer}>
        <div className={styles.logoSpace}>
          <span>Logo</span>
        </div>
        <h4>"미라클 농장에 오신 것을 환영합니다."</h4>
        <form className={styles.loginBox} onSubmit={submitPost}>
          <input
            type="text"
            value={name}
            placeholder="닉네임을 입력하세요."
            onChange={changeMemberName}
          ></input>
          <input
            type="password"
            value={pw}
            placeholder="비밀번호를 입력하세요."
            onChange={changeMemberPw}
          ></input>
          <button
            className={styles.loginBtn}
            disabled={isValid ? false : true}
            onClick={transformToJson}
          >
            로그인
          </button>
        </form>
        <button
          type="button"
          className={styles.switchBtn}
          onClick={setIsMember}
        >
          계정을 만들고 싶어요
        </button>
        <Modal isOpen={errorModalSwitch} style={customModalStyles}>
          <h3>안내문</h3>
          <p>로그인 불가!</p>
          <p>닉네임 또는 비밀번호를 재확인해주세요.</p>
          <p>비밀번호가 기억나지 않는다면 OOO에 문의하세요.</p>
          <button className={styles.ModalBtn} onClick={reTry}>
            닫기
          </button>
        </Modal>
      </div>
    </div>
  );
}

export default Login;
