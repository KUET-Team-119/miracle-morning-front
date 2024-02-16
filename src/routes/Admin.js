import { useEffect, useState } from "react";
import useDecodingJwt from "../hook/useDecodingJwt";
import { Button, Container, Form, Modal, Stack, Table } from "react-bootstrap";
import useAxiosGet from "../hook/useAxiosGet";
import useAxiosDelete from "../hook/useAxiosDelete";
import moment from "moment";
import useAxiosPatch from "../hook/useAxiosPatch";
import Menu from "../components/Offcanvas";
import menuIcon from "../images/menu.png";

function Admin() {
  const { myName } = useDecodingJwt();
  const [response, setResponse] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [ManagingModalShow, setManagingModalShow] = useState(false);
  const [checkModalShow, setCheckModalShow] = useState(false);
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [role, setRole] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [menuShow, setMenuShow] = useState(false);

  // 오늘의 루틴 조회
  const { responseData, error, isLoading, refetch } = useAxiosGet({
    url: `/api/admin/members`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setResponse(responseData);
      } else {
        // console.log(error);
      }
    }
  }, [responseData, error, isLoading]);

  const objToJson = () => {
    setRequestData(
      JSON.stringify({
        memberId: memberId,
        memberName: memberName,
        role: selectedRole,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPatch = (e) => {
    e.preventDefault();
    performPatch();
  };
  // 회원 권한 수정
  const {
    responseData: responseDataPatch,
    error: errorPatch,
    isLoading: isLoadingPatch,
    performPatch,
  } = useAxiosPatch({
    url: `/api/admin/member`,
    requestData,
  });
  useEffect(() => {
    if (!isLoadingPatch) {
      if (responseDataPatch !== null) {
        refetch();
        setSelectedRole("");
        closeManagingModal();
      } else {
        openErrorModal();
      }
    }
  }, [responseDataPatch, errorPatch, isLoadingPatch]);

  // Delete Http 요청
  const {
    responseData: responseDataDel,
    error: errorDel,
    isLoading: isLoadingDel,
    performDelete,
  } = useAxiosDelete({ url: `/api/member/${memberId}` });
  useEffect(() => {
    if (!isLoadingDel) {
      if (responseDataDel !== null) {
        refetch();
        closeCheckModal();
        closeManagingModal();
      } else {
        closeCheckModal();
        openErrorModal();
      }
    }
  }, [responseDataDel, errorDel, isLoadingDel]);

  const changeRole = (e) => {
    setSelectedRole(e.target.value);
  };

  // 관리 모달 열기
  const openManagingModal = (e) => {
    const dataSet = e.target.dataset;
    setMemberId(dataSet.id);
    setMemberName(dataSet.name);
    setRole(dataSet.role);
    setManagingModalShow(true);
  };

  // 관리 모달 닫기
  const closeManagingModal = () => {
    setManagingModalShow(false);
    setMemberId("");
    setMemberName("");
    setRole("");
  };

  // 확인 모달 열기
  const openCheckModal = () => {
    setCheckModalShow(true);
  };

  // 확인 모달 닫기
  const closeCheckModal = () => {
    setCheckModalShow(false);
  };

  // 에러 모달 열기
  const openErrorModal = () => {
    setErrorModalShow(true);
  };

  // 에러 모달 닫기
  const closeErrorModal = () => {
    setErrorModalShow(false);
  };

  return (
    <>
      <Menu
        show={menuShow}
        onHide={() => {
          setMenuShow(false);
        }}
      />
      <Stack gap={1}>
        <Container
          className="d-flex justify-content-center align-items-start"
          style={{ marginTop: 16, marginBottom: 16 }}
        >
          <p style={{ padding: 0, margin: 0 }}>
            안녕하세요 관리자 <span style={{ color: "#69973A" }}>{myName}</span>
            님 환영합니다.
          </p>
          <img
            className="ms-auto"
            src={menuIcon}
            onClick={() => {
              setMenuShow(true);
            }}
            alt="메뉴"
            style={{ width: 24, height: 24, marginRight: 12 }}
          ></img>
        </Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>닉네임</th>
              <th>비밀번호</th>
              <th>권한</th>
              <th>가입일자</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {response.map((member) => (
              <tr key={member.memberId}>
                <td>{member.memberId}</td>
                <td>{member.memberName}</td>
                <td>{member.password}</td>
                <td>{member.role}</td>
                <td>
                  {moment(member.createdAt).format(
                    "YYYY년 MM월 DD일 HH시 mm분"
                  )}
                </td>
                <td>
                  <Button
                    onClick={openManagingModal}
                    style={{
                      backgroundColor: "#8EC952",
                      borderColor: "#8EC952",
                    }}
                    data-id={member.memberId}
                    data-name={member.memberName}
                    data-role={member.role}
                  >
                    관리
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Stack>
      <Modal show={ManagingModalShow} centered>
        <Form onSubmit={submitPatch}>
          <Modal.Header>
            <Modal.Title
              style={{ fontSize: 20 }}
            >{`🌱 ${memberName}`}</Modal.Title>
            <Button
              className="ms-auto"
              onClick={openCheckModal}
              variant="danger"
            >
              강제 탈퇴
            </Button>
          </Modal.Header>
          <Modal.Body>
            <Stack gap={3}>
              <div>권한</div>
              <Form.Select onChange={changeRole} value={selectedRole}>
                <option>권한을 선택해주세요.</option>
                <option value="TEMP_USER">TEMP_USER</option>
                <option value="USER">USER</option>
              </Form.Select>
            </Stack>
          </Modal.Body>
          <Modal.Footer className="d-flex justify-content-center align-items-center">
            <Button
              type="button"
              variant="secondary"
              onClick={closeManagingModal}
            >
              닫기
            </Button>
            <Button
              type="submit"
              onClick={objToJson}
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
        show={checkModalShow}
        centered
      >
        <Modal.Body>
          <p>{memberName}님이 강제 탈퇴됩니다.</p>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center align-items-center">
          <Button variant="secondary" onClick={closeCheckModal}>
            취소
          </Button>
          <Button onClick={performDelete} variant="danger">
            확인
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        className="d-flex flex-column justify-content-center align-items-center"
        show={errorModalShow}
        centered
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center">
          <p>⛔ 실행이 완료되지 않았습니다.</p>
          <Button
            onClick={closeErrorModal}
            style={{ backgroundColor: "#8EC952", border: "none" }}
          >
            닫기
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Admin;
