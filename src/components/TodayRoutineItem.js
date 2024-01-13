import axios from "axios";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { useState } from "react";
import { useParams } from "react-router-dom";

function TodayRoutineItem({
  routineId,
  routineName,
  strategy,
  certification,
  startTime,
  endTime,
  setTempToReload,
}) {
  const [proof, setProof] = useState("");
  const [proveModalSwitch, setProveModalSwitch] = useState(false);
  const { memberName } = useParams();

  // 데이터 객체를 json 형태로 반환
  const transformToJson = () => {
    setProof(
      JSON.stringify({
        memberName: memberName, // To-do 보안 취약, 다른 방식으로 바꾸기
        routineName: routineName,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitProof = (e) => {
    e.preventDefault();
    postProof();
  };
  const postProof = async () => {
    try {
      const response = await axios.post(`/api/result`, proof, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      setTempToReload(); // GET 메소드 재호출 유도
      closeProveModal();
    } catch (error) {
      console.error(error);
      alert("에러 발생!");
    }
  };

  // 루틴 추가 모달 열기
  const openProveModal = () => {
    setProveModalSwitch(true);
    transformToJson();
  };

  // 인증 모달 닫기
  const closeProveModal = () => {
    setProveModalSwitch(false);
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
      <div className="container">
        <h3>루틴명: {routineName}</h3>
        <p>실천전략: {strategy}</p>
        <p>인증방법: {certification}</p>
        <p>시작시간: {startTime}</p>
        <p>종료시간: {endTime}</p>
        <button onClick={openProveModal}>인증</button>
        <Modal isOpen={proveModalSwitch} style={customModalStyles}>
          <button onClick={submitProof}>확인</button>
          <button onClick={closeProveModal}>취소</button>
        </Modal>
      </div>
    </div>
  );
}

TodayRoutineItem.propTypes = {
  routineId: PropTypes.number.isRequired,
  routineName: PropTypes.string.isRequired,
  strategy: PropTypes.string.isRequired,
  certification: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
};

export default TodayRoutineItem;
