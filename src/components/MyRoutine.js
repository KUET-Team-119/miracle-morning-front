import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import useAxiosPatch from "../hook/useAxiosPatch";
import useAxiosDelete from "../hook/useAxiosDelete";
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import styles from "../css/MyRoutine.module.css";

function MyRoutine({
  routineId,
  routineName,
  dayOfWeek,
  certification,
  startTime,
  endTime,
  isActivated,
  setToReload,
}) {
  const [newCertification, setNewCertification] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newIsActivated, setNewIsActivated] = useState("");
  const [newDayOfWeek, setNewDayOfWeek] = useState("");
  const [mon, setMon] = useState("");
  const [tue, setTue] = useState("");
  const [wed, setWed] = useState("");
  const [thu, setThu] = useState("");
  const [fri, setFri] = useState("");
  const [sat, setSat] = useState("");
  const [sun, setSun] = useState("");
  const [requestData, setRequestData] = useState("");
  const [isUpdateClicked, setIsUpdateClicked] = useState(false);
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [isEveryDay, setIsEveryDay] = useState(false);
  const [isAllDay, setIsAllDay] = useState(
    startTime === "00:00:00" && endTime === "23:59:00"
  );
  const navigate = useNavigate();

  const objToJson = () => {
    setRequestData(
      JSON.stringify({
        routineId: routineId,
        routineName: routineName,
        certification: newCertification,
        startTime: newStartTime + ":00",
        endTime: newEndTime + ":00",
        isActivated: newIsActivated,
        dayOfWeek: newDayOfWeek,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPatch = (e) => {
    e.preventDefault();
    setIsUpdateClicked(true);
    performPatch();
  };
  // 루틴 수정
  const { responseData, error, isLoading, performPatch } = useAxiosPatch({
    url: `/api/routine`,
    requestData,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setToReload();
      } else {
        const status = error.response.status;
        if (status === 401) {
          navigate("/unauthorized");
        } else if (status === 403) {
          navigate("/forbidden");
        } else if (status === 404) {
          navigate("/not-found");
        } else {
          navigate("/server-error");
        }
      }
    }
    closeUpdateModal();
  }, [responseData, error, isLoading]);

  // 루틴 삭제
  const {
    responseData: responseDataDel,
    error: errorDel,
    isLoading: isLoadingDel,
    performDelete,
  } = useAxiosDelete({ url: `/api/routine/${routineId}` });
  useEffect(() => {
    if (!isLoadingDel) {
      setDeleteModalShow(false);
      if (responseDataDel !== null) {
        setToReload();
      } else {
        const status = errorDel.response.status;
        if (status === 401) {
          navigate("/unauthorized");
        } else if (status === 403) {
          navigate("/forbidden");
        } else if (status === 404) {
          navigate("/not-found");
        } else {
          navigate("/server-error");
        }
      }
    }
  }, [responseDataDel, errorDel, isLoadingDel]);

  const clickDelete = () => {
    setIsDeleteClicked(true);
    performDelete();
  };

  // 요일 변경
  useEffect(() => {
    const tempDayOfWeek = mon + tue + wed + thu + fri + sat + sun;
    setNewDayOfWeek(tempDayOfWeek);
  }, [mon, tue, wed, thu, fri, sat, sun]);

  // 월요일 버튼 클릭 시 상태 및 색상 변경
  const changeMon = () => {
    setMon((prevMon) => (prevMon === "0" ? "1" : "0"));
  };

  // 화요일 버튼 클릭 시 상태 및 색상 변경
  const changeTue = () => {
    setTue((prevTue) => (prevTue === "0" ? "1" : "0"));
  };

  // 수요일 버튼 클릭 시 상태 및 색상 변경
  const changeWed = () => {
    setWed((prevWed) => (prevWed === "0" ? "1" : "0"));
  };

  // 목요일 버튼 클릭 시 상태 및 색상 변경
  const changeThu = () => {
    setThu((prevThu) => (prevThu === "0" ? "1" : "0"));
  };

  // 금요일 버튼 클릭 시 상태 및 색상 변경
  const changeFri = () => {
    setFri((prevFri) => (prevFri === "0" ? "1" : "0"));
  };

  // 토요일 버튼 클릭 시 상태 및 색상 변경
  const changeSat = () => {
    setSat((prevSat) => (prevSat === "0" ? "1" : "0"));
  };

  // 일요일 버튼 클릭 시 상태 및 색상 변경
  const changeSun = () => {
    setSun((prevSun) => (prevSun === "0" ? "1" : "0"));
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
    setUpdateModalShow(true);
    setNewCertification(certification);
    const startHourMinute = startTime.substring(0, 5);
    setNewStartTime(startHourMinute);
    const endHourMinute = endTime.substring(0, 5);
    setNewEndTime(endHourMinute);
    setIsEveryDay(dayOfWeek === "1111111");
    setIsAllDay(startTime === "00:00:00" && endTime === "23:59:00");
    setNewIsActivated(isActivated);
    setMon(dayOfWeek.substring(0, 1));
    setTue(dayOfWeek.substring(1, 2));
    setWed(dayOfWeek.substring(2, 3));
    setThu(dayOfWeek.substring(3, 4));
    setFri(dayOfWeek.substring(4, 5));
    setSat(dayOfWeek.substring(5, 6));
    setSun(dayOfWeek.substring(6));
  };

  // 루틴 수정 모달 닫기
  const closeUpdateModal = () => {
    setUpdateModalShow(false);
    setIsUpdateClicked(false);
  };

  // 루틴 삭제 모달 열기
  const openDeleteModal = () => {
    closeUpdateModal();
    setDeleteModalShow(true);
  };

  // 루틴 삭제 모달 닫기
  const closeDeleteModal = () => {
    openUpdateModal();
    setDeleteModalShow(false);
    setIsDeleteClicked(false);
  };

  // 데이터 유효성 검사
  const isValid =
    newDayOfWeek !== "0000000" &&
    newCertification !== "" &&
    newStartTime !== "" &&
    newEndTime !== "" &&
    newStartTime <= newEndTime &&
    !isUpdateClicked;

  const changeEveryDay = () => {
    if (newDayOfWeek !== "1111111" && !isEveryDay) {
      setMon("1");
      setTue("1");
      setWed("1");
      setThu("1");
      setFri("1");
      setSat("1");
      setSun("1");
    } else if (newDayOfWeek === "1111111" && isEveryDay) {
      setMon("0");
      setTue("0");
      setWed("0");
      setThu("0");
      setFri("0");
      setSat("0");
      setSun("0");
    }
    setIsEveryDay((current) => !current);
  };

  const changeAllDay = () => {
    setIsAllDay((current) => !current);
  };

  useEffect(() => {
    if (isAllDay) {
      setNewStartTime("00:00");
      setNewEndTime("23:59");
    }
  }, [isAllDay]);

  return (
    <>
      <div className={styles.container}>
        <Card body className={styles.routineCard} onClick={openUpdateModal}>
          <div className={styles.cardContent}>
            <div>🌱</div>
            {isActivated ? null : (
              <div className={styles.deactivated}>(비활성화)</div>
            )}
            <div>{routineName}</div>
          </div>
        </Card>
      </div>
      <Modal show={updateModalShow} centered>
        <Form onSubmit={submitPatch}>
          <Modal.Header className={styles.updateModalHeader}>
            <Modal.Title className={styles.updateModalTitle}>
              🌱 {routineName}
            </Modal.Title>
            <Button onClick={openDeleteModal} variant="danger">
              삭제
            </Button>
          </Modal.Header>
          <Modal.Body className={styles.updateModalBody}>
            <div className={styles.dayOfWeek}>
              <div className={styles.updateModalBodyTitle}>🌱 실천 요일</div>
              <ButtonGroup className={styles.dayOfWeekGroup}>
                <Button
                  className={
                    mon === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={mon}
                  onClick={changeMon}
                  disabled={isEveryDay}
                >
                  월
                </Button>
                <Button
                  className={
                    tue === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={tue}
                  onClick={changeTue}
                  disabled={isEveryDay}
                >
                  화
                </Button>
                <Button
                  className={
                    wed === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={wed}
                  onClick={changeWed}
                  disabled={isEveryDay}
                >
                  수
                </Button>
                <Button
                  className={
                    thu === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={thu}
                  onClick={changeThu}
                  disabled={isEveryDay}
                >
                  목
                </Button>
                <Button
                  className={
                    fri === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={fri}
                  onClick={changeFri}
                  disabled={isEveryDay}
                >
                  금
                </Button>
                <Button
                  className={
                    sat === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={sat}
                  onClick={changeSat}
                  disabled={isEveryDay}
                >
                  토
                </Button>
                <Button
                  className={
                    sun === "0"
                      ? styles.dayOfWeekBtn
                      : styles.selectedDayOfWeekBtn
                  }
                  value={sun}
                  onClick={changeSun}
                  disabled={isEveryDay}
                >
                  일
                </Button>
              </ButtonGroup>
              <div className={styles.checkEveryDay}>
                <div className={styles.modalNotice}>매일</div>
                <input
                  type="checkbox"
                  checked={isEveryDay}
                  onChange={changeEveryDay}
                />
              </div>
            </div>
            <div className={styles.actionTime}>
              <div className={styles.updateModalBodyTitle}>🌱 실천 시간</div>
              <InputGroup>
                <Form.Control
                  type="time"
                  value={newStartTime}
                  disabled={isAllDay}
                  onChange={changeStartTime}
                />
                <InputGroup.Text>~</InputGroup.Text>
                <Form.Control
                  type="time"
                  value={newEndTime}
                  disabled={isAllDay}
                  onChange={changeEndTime}
                />
              </InputGroup>
              <div className={styles.checkAllDay}>
                <div className={styles.modalNotice}>하루종일</div>
                <input
                  type="checkbox"
                  checked={isAllDay}
                  onChange={changeAllDay}
                />
              </div>
            </div>
            <div className={styles.certification}>
              <div className={styles.updateModalBodyTitle}>🌱 인증 방법</div>
              <Form.Control
                as="textarea"
                value={newCertification}
                placeholder="ex) 물이 따라진 컵 사진 촬영(30자 이내)"
                rows={2}
                maxLength={30}
                onChange={changeCertification}
              />
            </div>
            <div className={styles.activeToggle}>
              <div className={styles.activeToggleText}>
                🌱 루틴 활성화 / 비활성화
              </div>
              <Form.Check
                type="switch"
                value={newIsActivated}
                onChange={changeIsActivated}
                defaultChecked={isActivated}
              />
            </div>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <Button
              type="button"
              variant="secondary"
              onClick={closeUpdateModal}
            >
              닫기
            </Button>
            <Button
              className={styles.submitBtn}
              type="submit"
              onClick={objToJson}
              disabled={!isValid}
            >
              수정하기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={deleteModalShow} centered>
        <Modal.Header className={styles.deleteModalHeader}>
          <Modal.Title className={styles.deleteModalTitle}>
            🌱 {routineName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={styles.deleteModalBody}>
          <p className={styles.deleteModalBodyTitle}>루틴을 삭제할까요?</p>
          <p className={styles.deleteModalBodyContent}>
            루틴과 관련된 기록도 사라져요
          </p>
          <p className={styles.deleteModalBodyContent}>
            기록을 유지하고 싶거나 잠시 멈추고 싶다면
          </p>
          <p className={styles.deleteModalBodyContent}>비활성화를 권장해요</p>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button type="button" variant="secondary" onClick={closeDeleteModal}>
            취소
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={clickDelete}
            disabled={isDeleteClicked}
          >
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

MyRoutine.propTypes = {
  routineId: PropTypes.number.isRequired,
  routineName: PropTypes.string.isRequired,
  certification: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  isActivated: PropTypes.bool.isRequired,
  dayOfWeek: PropTypes.string.isRequired,
  setToReload: PropTypes.func.isRequired,
};

export default MyRoutine;
