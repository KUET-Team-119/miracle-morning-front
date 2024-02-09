import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Form,
  InputGroup,
  Modal,
  Stack,
} from "react-bootstrap";
import useAxiosDelete from "../hook/useAxiosDelete";
import useAxiosPatch from "../hook/useAxiosPatch";

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
  const [isAllDay, setIsAllDay] = useState(
    startTime === "00:00:00" && endTime === "23:59:00" ? true : false
  );

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
      <Card
        className="d-flex justify-content-center"
        body
        onClick={openUpdateModal}
        style={{
          height: 48,
          marginBottom: "10px",
          borderColor: "#8ec952",
          backgroundColor: "#e4f6d2",
        }}
      >
        <div className="d-flex justify-content-start">
          <div>🌱</div>
          {isActivated ? null : <div>(비활성화됨)</div>}
          <div className="ms-auto">{routineName}</div>
        </div>
      </Card>
      <Modal show={updateModalShow} centered>
        <Form onSubmit={submitPatch}>
          <Modal.Header className="d-flex justify-content-bwtween">
            <Modal.Title style={{ fontSize: 20 }}>🌱 {routineName}</Modal.Title>
            <Button
              className="ms-auto"
              onClick={openDeleteModal}
              variant="danger"
            >
              삭제
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Stack gap={3}>
              <div>
                <div>🌱 실천 요일</div>
                <ButtonGroup
                  className="d-flex"
                  style={{
                    borderStyle: "solid",
                    borderWidth: 1,
                    borderColor: "#8EC952",
                  }}
                >
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    월
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    화
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    수
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    목
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    금
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    토
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      border: "none",
                      color: "#6EB02A",
                    }}
                  >
                    일
                  </Button>
                </ButtonGroup>
              </div>
              <div>
                <div>🌱 실천 시간</div>
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
                <div className="d-flex justify-content-start align-items-center">
                  <span style={{ fontSize: 12, marginTop: 2, marginLeft: 4 }}>
                    하루종일
                  </span>
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={changeAllDay}
                    style={{
                      width: 16,
                      height: 16,
                      display: "inline-block",
                      marginTop: 2,
                      marginLeft: 4,
                      accentColor: "#8EC952",
                    }}
                  />
                </div>
              </div>
              <div>
                <div>🌱 실천 전략</div>
                <Form.Control
                  type="text"
                  value={newStrategy}
                  placeholder="(20자 이내)"
                  maxLength={20}
                  onChange={changeStrategy}
                />
              </div>
              <div>
                <div>🌱 인증 방법</div>
                <Form.Control
                  type="text"
                  value={newCertification}
                  placeholder="ex) 물이 따라진 컵 사진 촬영(20자 이내)"
                  maxLength={20}
                  onChange={changeCertification}
                />
              </div>
              <div className="d-flex">
                <div style={{ marginRight: 12 }}>🌱 루틴 활성화 / 비활성화</div>
                <Form.Check
                  type="switch"
                  value={newIsActivated}
                  onChange={changeIsActivated}
                  defaultChecked={isActivated}
                />
              </div>
            </Stack>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center align-items-center">
            <Button
              type="button"
              variant="secondary"
              onClick={closeUpdateModal}
            >
              닫기
            </Button>
            <Button
              type="submit"
              onClick={objToJson}
              disabled={!isValid}
              style={{
                backgroundColor: "#8EC952",
                borderColor: "#8EC952",
              }}
            >
              수정하기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={deleteModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p>🌱 루틴을 삭제합니다.</p>
          <p>정말로 삭제하시겠습니까?</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
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
  strategy: PropTypes.string.isRequired,
  certification: PropTypes.string.isRequired,
  startTime: PropTypes.string.isRequired,
  endTime: PropTypes.string.isRequired,
  isActivated: PropTypes.bool.isRequired,
};

export default MyRoutine;
