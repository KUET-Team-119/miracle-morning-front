import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import moment from "moment";
import useDecodingJwt from "../hook/useDecodingJwt";
import useAxiosGet from "../hook/useAxiosGet";
import AdminMenu from "../components/AdminMenu";
import { Button, Card, Col, Modal, Row, Spinner } from "react-bootstrap";
import styles from "../css/AdminImages.module.css";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";

function AdminImages() {
  const { myName } = useDecodingJwt();
  const [responseProof, setResponseProof] = useState([]);
  const [menuShow, setMenuShow] = useState(false);
  const [data, setData] = useState("");
  const [proveModalShow, setProveModalShow] = useState(false);
  const [errorModalShow, setErrorModalShow] = useState(false);
  const navigate = useNavigate();

  const goToMemberManaging = () => {
    navigate("/admin/membermanaging");
  };

  // 인증 사진 조회
  const { responseData, error, isLoading, refetch } = useAxiosGet({
    url: `/api/admin/results/recent`,
  });
  useEffect(() => {
    if (!isLoading) {
      if (responseData !== null) {
        setResponseProof(responseData);
      } else {
        // console.log(errorProof);
      }
    }
  }, [responseData, error, isLoading]);

  const objToJson = (e) => {
    setData(
      JSON.stringify({
        resultId: e.target.dataset.resultId,
        routineName: e.target.dataset.routineName,
        doneAt: null,
      })
    );
    openProveModal();
  };

  // json 데이터를 서버로 전송
  const submitPatch = (e) => {
    e.preventDefault();
    patchProof();
  };
  const patchProof = async () => {
    const formData = new FormData();
    formData.append("file", null);

    const blob = new Blob([data], {
      type: "application/json",
    });
    formData.append("data", blob);

    try {
      const response = await axios.patch(`/api/results`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      });
      refetch(); // GET 메소드 재호출 유도
      closeProveModal();
    } catch (error) {
      closeProveModal();
      openErrorModal();
    }
  };

  // 인증 철회 모달 열기
  const openProveModal = () => {
    setProveModalShow(true);
  };

  // 인증 철회 모달 닫기
  const closeProveModal = () => {
    setProveModalShow(false);
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
      <div className={styles.container}>
        <AdminMenu
          show={menuShow}
          onHide={() => {
            setMenuShow(false);
          }}
        />
        <div className={styles.header}>
          <div className={styles.intro}>
            <p>
              관리자 <span>{myName}</span>님 환영합니다.
            </p>
            <p>사진 관리 페이지입니다🔧</p>
          </div>
          <div className={styles.headerIcon}>
            <img src={homeIcon} onClick={goToMemberManaging} alt="홈" />
            <img
              src={menuIcon}
              onClick={() => {
                setMenuShow(true);
              }}
              alt="메뉴"
            />
          </div>
        </div>
        {isLoading ? (
          <div className={styles.spinner}>
            <Spinner animation="border" />
          </div>
        ) : (
          <div className={styles.content}>
            <Row xs={1} sm={2} md={3} lg={4} className="g-3">
              {responseProof.map((result) => (
                <Col key={result.resultId}>
                  <Card className={styles.card}>
                    <Card.Img
                      variant="top"
                      src={`data:image;base64,${result.fileBase64}`}
                    />
                    <Card.Body>
                      <Card.Title>{result.routineName}</Card.Title>
                      <Card.Subtitle>{result.memberName}</Card.Subtitle>
                      <Card.Text>
                        {moment(result.doneAt).format(
                          "YYYY년 MM일 DD일 HH시 mm분"
                        )}
                      </Card.Text>
                      <Button
                        variant="danger"
                        onClick={objToJson}
                        data-result-id={result.resultId}
                        data-routine-name={result.resultId}
                      >
                        인증 철회
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </div>
      <Modal show={proveModalShow} centered>
        <Modal.Body className={styles.proveModalBody}>
          <p className={styles.proveModalBodyTitle}>인증을 철회합니다.</p>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={closeProveModal}>
            취소
          </Button>
          <Button onClick={submitPatch} variant="danger">
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

export default AdminImages;
