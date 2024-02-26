import { useEffect, useState } from "react";
import moment from "moment";
import useDecodingJwt from "../hook/useDecodingJwt";
import useAxiosGet from "../hook/useAxiosGet";
import AdminMenu from "../components/AdminMenu";
import styles from "../css/AdminComplaints.module.css";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Spinner } from "react-bootstrap";

function AdminComplaints() {
  const { myName } = useDecodingJwt();
  const [menuShow, setMenuShow] = useState(false);
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();

  const goToMemberManaging = () => {
    navigate("/admin/member-managing");
  };

  // 사용자의 루틴 조회
  const { responseData, error, isLoading } = useAxiosGet({
    url: `/api/admin/complaints`,
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

  return (
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
            <p>오류 관리 페이지입니다🔧</p>
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
      </div>
      {isLoading ? (
        <div className={styles.spinner}>
          <Spinner animation="border" />
        </div>
      ) : (
        <div className={styles.content}>
          {response.length === 0 ? (
            <p className={styles.noData}>데이터가 없습니다.</p>
          ) : (
            <Row xs={1} sm={2} md={3} className="g-3">
              {response.map((complaint) => (
                <Col key={complaint.complaintId}>
                  <Card className={styles.card}>
                    <Card.Body>
                      <Card.Title>{complaint.memberName}</Card.Title>
                      <Card.Subtitle>
                        {moment(complaint.createdAt).format(
                          "YYYY년 MM월 DD일 HH시 mm분"
                        )}
                      </Card.Subtitle>
                      <Card.Text>{complaint.content}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminComplaints;
