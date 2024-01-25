import MyRoutine from "../components/MyRoutine";
import { useEffect, useState } from "react";
import useAxiosGet from "../hook/useAxiosGet";
import useAxiosPost from "../hook/useAxiosPost";
import useDecodingJwt from "../hook/useDecodingJwt";
import {
  Button,
  Container,
  Spinner,
  Stack,
  Modal,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

function Managing() {
  const [routines, setRoutines] = useState([]);
  const [addModalShow, setAddModalShow] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState("");
  const [newStrategy, setNewStrategy] = useState("");
  const [newCertification, setNewCertification] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [requestData, setRequestData] = useState("");
  const who = useDecodingJwt();

  // 사용자의 루틴 조회
  const { responseData, error, isLoading, refetch } = useAxiosGet({
    url: `/api/routine`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        const sortedResponseData = [...responseData]; // 복사본을 만들어 정렬
        sortedResponseData.sort((a, b) => {
          // isActivated가 true인 경우를 먼저 정렬, false인 경우는 나중에 정렬
          if (a.isActivated === b.isActivated) {
            // isActivated 값이 같은 경우 startTime으로 정렬
            return a.startTime.localeCompare(b.startTime);
          } else {
            return a.isActivated ? -1 : 1; // true가 앞에 오도록 정렬
          }
        });
        setRoutines(sortedResponseData);
      } else {
        // console.log(error);
      }
    }
  }, [responseData, error, isLoading]);

  // 데이터 객체를 json 형태로 변환
  const objToJson = () => {
    setRequestData(
      JSON.stringify({
        routineName: newRoutineName,
        memberName: who,
        strategy: newStrategy,
        certification: newCertification,
        startTime: newStartTime,
        endTime: newEndTime,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPost = (e) => {
    e.preventDefault();
    performPost();
  };
  // 사용자 루틴 추가
  const {
    responseData: responseDataPost,
    error: errorPost,
    isLoading: isLoadingPost,
    performPost,
  } = useAxiosPost({
    url: `/api/routine`,
    requestData,
  });
  useEffect(() => {
    if (!isLoadingPost) {
      if (responseDataPost !== null) {
        closeAddModal();
        refetch();
      } else {
        closeAddModal();
      }
    }
  }, [responseDataPost, errorPost, isLoadingPost]);

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
    setAddModalShow(true);
  };

  // 루틴 추가 모달 닫기
  const closeAddModal = () => {
    setAddModalShow(false);
    setNewRoutineName("");
    setNewStrategy("");
    setNewCertification("");
    setNewStartTime("");
    setNewEndTime("");
  };

  return (
    <>
      <Stack gap={1}>
        <Container>
          <Stack direction="horizontal">
            <h4>{who}님의 모든 루틴</h4>
            <Button
              className="ms-auto rounded-circle"
              type="button"
              onClick={openAddModal}
            >
              +
            </Button>
          </Stack>
        </Container>
        <Container>
          <Row className="justify-content-center">
            {isLoading ? (
              <Spinner animation="border" />
            ) : (
              routines.map((routine) => (
                <MyRoutine
                  key={routine.routineId}
                  routineId={routine.routineId}
                  routineName={routine.routineName}
                  strategy={routine.strategy}
                  certification={routine.certification}
                  startTime={routine.startTime}
                  endTime={routine.endTime}
                  isActivated={routine.isActivated}
                  setToReload={refetch}
                />
              ))
            )}
          </Row>
        </Container>
        <Modal show={addModalShow}>
          <Form onSubmit={submitPost}>
            <Modal.Header>루틴 추가</Modal.Header>
            <Modal.Body>
              <Stack gap={3}>
                <InputGroup>
                  <InputGroup.Text>루틴 이름</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={newRoutineName}
                    onChange={changeRoutineName}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>인증 시간</InputGroup.Text>
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
                  <InputGroup.Text>실천 전략</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={newStrategy}
                    onChange={changeStrategy}
                  />
                </InputGroup>
                <InputGroup>
                  <InputGroup.Text>인증 방법</InputGroup.Text>
                  <Form.Control
                    type="text"
                    value={newCertification}
                    onChange={changeCertification}
                  />
                </InputGroup>
              </Stack>
            </Modal.Body>
            <Modal.Footer>
              <Button type="button" variant="secondary" onClick={closeAddModal}>
                취소
              </Button>
              <Button
                type="submit"
                disabled={isValid ? false : true}
                onClick={objToJson}
              >
                추가
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Stack>
    </>
  );
}

export default Managing;
