import { useState, useEffect } from "react";
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
  const [requestData, setRequestData] = useState("");
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [isAllDay, setIsAllDay] = useState(
    startTime === "00:00:00" && endTime === "23:59:00" ? true : false
  );

  const objToJson = () => {
    setRequestData(
      JSON.stringify({
        routineId: routineId,
        routineName: routineName,
        certification: newCertification,
        startTime: newStartTime + ":00",
        endTime: newEndTime + ":00",
        isActivated: newIsActivated,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPatch = (e) => {
    e.preventDefault();
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
        // console.log(error);
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
      if (responseDataDel !== null) {
        setDeleteModalShow(false);
        setToReload();
      } else {
        setDeleteModalShow(false);
      }
    }
  }, [responseDataDel, errorDel, isLoadingDel]);

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
    setIsAllDay(
      startTime === "00:00:00" && endTime === "23:59:00" ? true : false
    );
    setNewIsActivated(isActivated);
  };

  // 루틴 수정 모달 닫기
  const closeUpdateModal = () => {
    setUpdateModalShow(false);
  };

  // 루틴 삭제 모달 열기
  const openDeleteModal = () => {
    setDeleteModalShow(true);
  };

  // 루틴 삭제 모달 닫기
  const closeDeleteModal = () => {
    setDeleteModalShow(false);
  };

  // 데이터 유효성 검사
  const isValid =
    newCertification !== "" &&
    newStartTime !== "" &&
    newEndTime !== "" &&
    newStartTime <= newEndTime;

  const changeAllDay = () => {
    setIsAllDay((current) => !current);
  };

  useEffect(() => {
    if (isAllDay === true) {
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
            {isActivated ? null : <div>(비활성화됨)</div>}
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
                <Button className={styles.dayOfWeekBtn}>월</Button>
                <Button className={styles.dayOfWeekBtn}>화</Button>
                <Button className={styles.dayOfWeekBtn}>수</Button>
                <Button className={styles.dayOfWeekBtn}>목</Button>
                <Button className={styles.dayOfWeekBtn}>금</Button>
                <Button className={styles.dayOfWeekBtn}>토</Button>
                <Button className={styles.dayOfWeekBtn}>일</Button>
              </ButtonGroup>
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
                🌱 루틴 비활성화 / 활성화
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
        <Modal.Body className={styles.deleteModalBody}>
          <p className={styles.deleteModalBodyTitle}>🌱 루틴을 삭제합니다.</p>
          <p className={styles.deleteModalBodyContent}>
            정말로 삭제하시겠습니까?
          </p>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button type="button" variant="secondary" onClick={closeDeleteModal}>
            취소
          </Button>
          <Button type="button" variant="danger" onClick={performDelete}>
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
  setToReload: PropTypes.func.isRequired,
};

export default MyRoutine;
