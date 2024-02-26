import { useEffect, useState } from "react";
import useDecodingJwt from "../hook/useDecodingJwt";
import { Button, Form, Modal, Spinner, Table } from "react-bootstrap";
import useAxiosGet from "../hook/useAxiosGet";
import useAxiosDelete from "../hook/useAxiosDelete";
import moment from "moment";
import useAxiosPatch from "../hook/useAxiosPatch";
import styles from "../css/AdminMemberManaging.module.css";
import AdminMenu from "../components/AdminMenu";
import menuIcon from "../images/menu.png";
import { useNavigate } from "react-router-dom";

function AdminMemberManaging() {
  const { myName } = useDecodingJwt();
  const [response, setResponse] = useState([]);
  const [requestData, setRequestData] = useState([]);
  const [ManagingModalShow, setManagingModalShow] = useState(false);
  const [checkModalShow, setCheckModalShow] = useState(false);
  const [errorModalShow, setErrorModalShow] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [memberName, setMemberName] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [menuShow, setMenuShow] = useState(false);
  const navigate = useNavigate();

  // 오늘의 루틴 조회
  const { responseData, error, isLoading, refetch } = useAxiosGet({
    url: `/api/admin/members`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setResponse(responseData);
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
        setSelectedRole("");
        closeManagingModal();
        const status = error.response.status;
        if (status === 401) {
          navigate("/unauthorized");
        } else if (status === 403) {
          openErrorModal();
        } else if (status === 404) {
          openErrorModal();
        } else {
          navigate("/server-error");
        }
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
        closeManagingModal();
        const status = error.response.status;
        if (status === 401) {
          navigate("/unauthorized");
        } else if (status === 403) {
          openErrorModal();
        } else if (status === 404) {
          openErrorModal();
        } else {
          navigate("/server-error");
        }
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
    setManagingModalShow(true);
  };

  // 관리 모달 닫기
  const closeManagingModal = () => {
    setManagingModalShow(false);
    setMemberId("");
    setMemberName("");
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

  const isValid = selectedRole !== "";

  return (
    <>
      <div className={styles.container}>
        <AdminMenu
          show={menuShow}
          onHide={() => {
            setMenuShow(false);
          }}
        />
        <div className={styles.headerContainer}>
          <div className={styles.header}>
            <div className={styles.intro}>
              <p>
                관리자 <span>{myName}</span>님 환영합니다.
              </p>
              <p>사용자 관리 페이지입니다🔧</p>
            </div>
            <div className={styles.headerIcon}>
              <img
                src={menuIcon}
                onClick={() => {
                  setMenuShow(true);
                }}
                alt="메뉴"
              />
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className={styles.spinner}>
            <Spinner animation="border" />
          </div>
        ) : (
          <div className={styles.content}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>id</th>
                  <th>닉네임</th>
                  <th>비밀번호</th>
                  <th>권한</th>
                  <th>가입일자</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {response.length === 0 ? (
                  <tr>
                    <td className={styles.noData} colSpan="6">
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  response.map((member) => (
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
                          className={styles.managingBtn}
                          onClick={openManagingModal}
                          data-id={member.memberId}
                          data-name={member.memberName}
                          data-role={member.role}
                        >
                          관리
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        )}
      </div>
      <Modal show={ManagingModalShow} centered>
        <Form onSubmit={submitPatch}>
          <Modal.Header>
            <Modal.Title
              className={styles.managingModalTitle}
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
            <div className={styles.managingModalBodyTitle}>권한</div>
            <Form.Select onChange={changeRole} value={selectedRole}>
              <option value="">권한을 선택해주세요.</option>
              <option value="TEMP_USER">TEMP_USER</option>
              <option value="USER">USER</option>
            </Form.Select>
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <Button
              type="button"
              variant="secondary"
              onClick={closeManagingModal}
            >
              닫기
            </Button>
            <Button
              className={styles.submitBtn}
              type="submit"
              onClick={objToJson}
              disabled={isValid ? false : true}
            >
              수정하기
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal show={checkModalShow} centered>
        <Modal.Body className={styles.checkModalBody}>
          <p className={styles.checkModalBodyTitle}>
            {memberName}님이 강제 탈퇴됩니다.
          </p>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={closeCheckModal}>
            취소
          </Button>
          <Button onClick={performDelete} variant="danger">
            확인
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={errorModalShow} centered>
        <Modal.Body className={styles.errorModalBody}>
          <p className={styles.errorModalBodyTitle}>
            ⛔ 실행이 완료되지 않았습니다.
          </p>
          <Button className={styles.errorModalBtn} onClick={closeErrorModal}>
            닫기
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AdminMemberManaging;
