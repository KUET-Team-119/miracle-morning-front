import styles from "../css/Managing.module.css";
import RoutineItem from "../components/RoutineItem";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Modal from "react-modal";
import axios from "axios";

function Managing() {
  const [routines, setRoutines] = useState([]);
  const [addModalSwitch, setAddModalSwitch] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newStrategy, setNewStrategy] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [routine, setRoutine] = useState("");
  const [tempToReload, setTempToReload] = useState(true);
  const { memberName } = useParams();

  // To-do 사용자가 {memberName}을 임의로 바꾸면 보안 사고 발생 -> 보완하기
  const getRoutines = async () => {
    try {
      const response = await axios.get(`/api/routine/${memberName}`);
      console.log(response.data);
      const sortByStartTime = response.data.sort(
        (a, b) => a.startTime.localeCompare(b.startTime) // 시작시간을 기준으로 정렬
      );
      const sortByIsActivated = sortByStartTime.sort(
        (a, b) => b.isActivated - a.isActivated // 활성화여부를 기준으로 정렬
      );
      setRoutines(sortByIsActivated);
    } catch (error) {
      console.error(error);
    }
  };

  // 데이터 객체를 json 형태로 변환
  const transformToJson = () => {
    setRoutine(
      JSON.stringify({
        routineName: newRoutineName,
        memberName: memberName, // To-do 보안 취약, 다른 방식으로 바꾸기
        strategy: newStrategy,
        certification: newCertification,
        startTime: newStartTime,
        endTime: newEndTime,
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
      const response = await axios.post(`/api/routine`, routine, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      reload();
      closeAddModal();
    } catch (error) {
      console.error(error);
      alert("에러 발생!");
      closeAddModal();
    }
  };

  useEffect(() => {
    getRoutines();
  }, [tempToReload]); // 마운트 때만 정보 가져옴 -> 변경해야 함

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
    const toTimeType = e.target.value + ":00";
    setNewStartTime(toTimeType);
  };

  const changeEndTime = (e) => {
    const toTimeType = e.target.value + ":00";
    setNewEndTime(toTimeType);
  };

  // GET 메소드 재호출 유도
  const reload = () => {
    setTempToReload((current) => !current);
  };

  // 데이터 유효성 검사 -> 공백이 있는지와 시간 순서가 맞는지 구분하기
  const isValid =
    newRoutineName !== "" &&
    newStrategy !== "" &&
    newCertification !== "" &&
    newStartTime !== "" &&
    newEndTime !== "" &&
    newStartTime <= newEndTime;

  // 루틴 추가 모달 열기
  const openAddModal = () => {
    setAddModalSwitch(true);
  };

  // 루틴 추가 모달 닫기
  const closeAddModal = () => {
    setAddModalSwitch(false);
    setNewRoutineName("");
    setNewStrategy("");
    setNewCertification("");
    setNewStartTime("");
    setNewEndTime("");
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
      <div className={styles.managingBody}>
        <div className={styles.managingContainer}>
          <div className={styles.header}>
            <h4>{memberName}님의 모든 루틴</h4>
            <button type="button" onClick={openAddModal}>
              루틴 추가하기
            </button>
            <div>
              <p>MyPage</p>
            </div>
          </div>
          <div className={styles.content}>
            <div className={styles.routineContainer}>
              {routines.map((routine) => (
                <RoutineItem
                  key={routine.routineId}
                  routineId={routine.routineId}
                  routineName={routine.routineName}
                  strategy={routine.strategy}
                  certification={routine.certification}
                  startTime={routine.startTime}
                  endTime={routine.endTime}
                  isActivated={routine.isActivated}
                  setTempToReload={reload}
                />
              ))}
            </div>
            <Modal isOpen={addModalSwitch} style={customModalStyles}>
              <form className={styles.addBox} onSubmit={submitRoutine}>
                <input
                  type="text"
                  value={newRoutineName}
                  placeholder="루틴명을 입력하세요."
                  onChange={changeRoutineName}
                ></input>
                <input
                  type="text"
                  value={newStrategy}
                  placeholder="실천전략을 입력하세요."
                  onChange={changeStrategy}
                ></input>
                <input
                  type="text"
                  value={newCertification}
                  placeholder="인증방법을 입력하세요."
                  onChange={changeCertification}
                ></input>
                <input
                  type="time"
                  value={newStartTime}
                  placeholder="시작시간을 입력하세요."
                  onChange={changeStartTime}
                ></input>
                <input
                  type="time"
                  value={newEndTime}
                  placeholder="종료시간을 입력하세요."
                  onChange={changeEndTime}
                ></input>
                <button
                  disabled={isValid ? false : true}
                  onClick={transformToJson}
                >
                  추가
                </button>
                <button type="button" onClick={closeAddModal}>
                  취소
                </button>
              </form>
            </Modal>
          </div>
          <div className={styles.navContainer}>
            <div className="navItem">
              <Link to={`/home/${memberName}`}>홈</Link>
            </div>
            <div className={styles.navContainer}>
              <Link to={`/routines/${memberName}`}>루틴관리</Link>
            </div>
            <div className={styles.navContainer}>
              <Link to={`/statistics`}>루틴현황</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Managing;
