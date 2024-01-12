import PropTypes from "prop-types";
import { useState } from "react";
import styles from "../css/RoutineItem.module.css";
import Modal from "react-modal";
import axios from "axios";

function RoutineItem({
  routineId,
  routineName,
  strategy,
  certification,
  startTime,
  endTime,
  isActivated,
  setTempToReload,
}) {
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newStrategy, setNewStrategy] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newIsActivated, setNewIsActivated] = useState("");
  const [routine, setRoutine] = useState("");
  const [updateModalSwitch, setUpdateModalSwitch] = useState(false);
  const [deleteModalSwitch, setDeleteModalSwitch] = useState(false);

  const transformToJson = () => {
    setRoutine(
      JSON.stringify({
        routineName: newRoutineName,
        strategy: newStrategy,
        certification: newCertification,
        startTime: newStartTime + ":00",
        endTime: newEndTime + ":00",
        isActivated: newIsActivated,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitRoutine = (e) => {
    e.preventDefault();
    postRoutine();
  };
  const postRoutine = async () => {
    try {
      const response = await axios.put(`/api/routine/${routineId}`, routine, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      closeUpdateModal();
      setTempToReload(); // GET 메소드 재호출 유도
    } catch (error) {
      console.error(error);
      alert("에러 발생!");
      closeUpdateModal();
    }
  };

  const deleteRoutine = async () => {
    try {
      const response = await axios.delete(`/api/routine/${routineId}`);
      console.log(response.data);
      setDeleteModalSwitch(false);
      setTempToReload(); // GET 메소드 재호출 유도
    } catch (error) {
      console.error(error);
      setDeleteModalSwitch(false);
      alert("에러 발생!");
    }
  };

  const changeRoutineName = (e) => {
    setNewRoutineName(e.target.value);
  };

  const changeStrategy = (e) => {
    setNewStrategy(e.target.value);
  };

  const changeCertification = (e) => {
    setNewCertification(e.target.value);
  };

  const changeStartTime = (e) => {
    setNewStartTime(e.target.value);
  };

  const changeEndTime = (e) => {
    setNewEndTime(e.target.value);
  };

  const changeIsActivated = (e) => {
    setNewIsActivated(e.target.checked);
  };

  // 루틴 수정 모달 열기
  const openUpdateModal = () => {
    setUpdateModalSwitch(true);
    setNewRoutineName(routineName);
    setNewStrategy(strategy);
    setNewCertification(certification);
    const startHourMinute = startTime.substring(0, 5);
    setNewStartTime(startHourMinute);
    const endHourMinute = endTime.substring(0, 5);
    setNewEndTime(endHourMinute);
    setNewIsActivated(isActivated);
  };

  // 루틴 수정 모달 닫기
  const closeUpdateModal = () => {
    setUpdateModalSwitch(false);
  };

  // 루틴 삭제 모달 열기
  const openDeleteModal = () => {
    setDeleteModalSwitch(true);
  };

  // 루틴 삭제 모달 닫기
  const closeDeleteModal = () => {
    setDeleteModalSwitch(false);
  };

  // 데이터 유효성 검사
  const isValid =
    newRoutineName !== "" &&
    newStrategy !== "" &&
    newCertification !== "" &&
    newStartTime !== "" &&
    newEndTime !== "" &&
    newStartTime <= newEndTime;

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
      <div
        className={`${styles.container} ${
          isActivated ? styles.abledRoutine : styles.disabledRoutine
        }`}
      >
        <h3>루틴명: {routineName}</h3>
        <p>실천전략: {strategy}</p>
        <p>인증방법: {certification}</p>
        <p>시작시간: {startTime}</p>
        <p>종료시간: {endTime}</p>
        <p>활성화여부: {isActivated ? "예" : "아니오"}</p>
        <button onClick={openUpdateModal}>수정</button>
        <button onClick={openDeleteModal}>삭제</button>
      </div>
      <Modal isOpen={updateModalSwitch} style={customModalStyles}>
        <form className={styles.addBox} onSubmit={submitRoutine}>
          <input
            type="text"
            value={newRoutineName}
            placeholder="새로운 루틴명을 입력하세요."
            onChange={changeRoutineName}
          ></input>
          <input
            type="text"
            value={newStrategy}
            placeholder="새로운 실천전략을 입력하세요."
            onChange={changeStrategy}
          ></input>
          <input
            type="text"
            value={newCertification}
            placeholder="새로운 인증방법을 입력하세요."
            onChange={changeCertification}
          ></input>
          <input
            type="time"
            value={newStartTime}
            placeholder="새로운 시작시간을 입력하세요."
            onChange={changeStartTime}
          ></input>
          <input
            type="time"
            value={newEndTime}
            placeholder="새로운 종료시간을 입력하세요."
            onChange={changeEndTime}
          ></input>
          <p>활성화여부</p>
          <input
            type="checkbox"
            onClick={changeIsActivated}
            value={newIsActivated}
            defaultChecked={newIsActivated}
          ></input>
          <button disabled={isValid ? false : true} onClick={transformToJson}>
            수정
          </button>
          <button type="button" onClick={closeUpdateModal}>
            취소
          </button>
        </form>
      </Modal>
      <Modal isOpen={deleteModalSwitch} style={customModalStyles}>
        <h3>정말로 삭제하시겠습니까?</h3>
        <button onClick={deleteRoutine}>예</button>
        <button onClick={closeDeleteModal}>아니오</button>
      </Modal>
    </div>
  );
}

RoutineItem.propTypes = {
  routineId: PropTypes.number.isRequired,
  routineName: PropTypes.string.isRequired,
  strategy: PropTypes.string.isRequired,
  certification: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  isActivated: PropTypes.bool.isRequired,
};

export default RoutineItem;
