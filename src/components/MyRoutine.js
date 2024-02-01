/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Button, Card, Form, InputGroup, Modal, Stack } from "react-bootstrap";
import useAxiosDelete from "../hook/useAxiosDelete";
import useAxiosPut from "../hook/useAxiosPut";

function MyRoutine({
  routineId,
  routineName,
  strategy,
  certification,
  startTime,
  endTime,
  isActivated,
  setToReload,
}) {
  const [newStrategy, setNewStrategy] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [newIsActivated, setNewIsActivated] = useState("");
  const [requestData, setRequestData] = useState("");
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);

  const objToJson = () => {
    setRequestData(
      JSON.stringify({
        routineId: routineId,
        routineName: routineName,
        strategy: newStrategy,
        certification: newCertification,
        startTime: newStartTime + ":00",
        endTime: newEndTime + ":00",
        isActivated: newIsActivated,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPut = (e) => {
    e.preventDefault();
    performPut();
  };
  // 루틴 수정
  const { responseData, error, isLoading, performPut } = useAxiosPut({
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
    setUpdateModalShow(true);
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
    newStrategy !== "" &&
    newCertification !== "" &&
    newStartTime !== "" &&
    newEndTime !== "" &&
    newStartTime <= newEndTime;

  return (
    <div>
      <Card
        body
        border={isActivated ? "primary" : "warning"}
        style={{ marginBottom: "10px" }}
      >
        <Stack direction="horizontal" gap={3}>
          <div>{isActivated ? "💙" : "💛"}</div>
          <div>
            {startTime.substring(0, 5)} ~ {endTime.substring(0, 5)}
          </div>
          <div className="ms-auto">{routineName}</div>
          <Button onClick={openUpdateModal}>수정</Button>
          <Button onClick={openDeleteModal} variant="danger">
            삭제
          </Button>
        </Stack>
      </Card>
      <Modal show={updateModalShow}>
        <Form onSubmit={submitPut}>
          <Modal.Header>
            <Modal.Title>{routineName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Stack gap={3}>
              <InputGroup>
                <InputGroup.Text>인증시간</InputGroup.Text>
                <Form.Control
                  type="time"
                  value={newStartTime}
                  onChange={changeStartTime}
                />
                <Form.Control
                  type="time"
                  value={newEndTime}
                  onChange={changeEndTime}
                />
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>실천전략</InputGroup.Text>
                <Form.Control
                  type="text"
                  value={newStrategy}
                  onChange={changeStrategy}
                />
              </InputGroup>
              <InputGroup>
                <InputGroup.Text>인증방법</InputGroup.Text>
                <Form.Control
                  type="text"
                  value={newCertification}
                  onChange={changeCertification}
                />
              </InputGroup>
              <Form.Check
                type="switch"
                label="활성화여부"
                value={newIsActivated}
                onChange={changeIsActivated}
                defaultChecked={isActivated}
              />
            </Stack>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="button"
              variant="secondary"
              onClick={closeUpdateModal}
            >
              취소
            </Button>
            <Button type="submit" onClick={objToJson} disabled={!isValid}>
              확인
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={deleteModalShow}>
        <Modal.Header>
          <Modal.Title>{routineName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>정말로 삭제하시겠습니까?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={closeDeleteModal}>
            취소
          </Button>
          <Button type="button" variant="danger" onClick={performDelete}>
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

MyRoutine.propTypes = {
  routineId: PropTypes.number.isRequired,
  routineName: PropTypes.string.isRequired,
  strategy: PropTypes.string.isRequired,
  certification: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  isActivated: PropTypes.bool.isRequired,
};

export default MyRoutine;
