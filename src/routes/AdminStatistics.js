import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDecodingJwt from "../hook/useDecodingJwt";
import useAxiosGet from "../hook/useAxiosGet";
import AdminMenu from "../components/AdminMenu";
import { Spinner, Table } from "react-bootstrap";
import styles from "../css/AdminStatistics.module.css";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";

function AdminStatistics() {
  const { myName } = useDecodingJwt();
  const [menuShow, setMenuShow] = useState(false);
  const [response, setResponse] = useState([]);
  const navigate = useNavigate();

  const goToMemberManaging = () => {
    navigate("/admin/member-managing");
  };

  // 사용자별 루틴 통계 조회
  const { responseData, error, isLoading } = useAxiosGet({
    url: `/api/admin/members/statistics`,
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
              관리자 <span>{myName}</span>님 환영합니다
            </p>
            <p>통계 관리 페이지입니다🔧</p>
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
      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.spinner}>
            <Spinner animation="border" />
          </div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>닉네임</th>
                <th>실천 기록 수</th>
                <th>전체 기록 수</th>
                <th>루틴 달성률</th>
              </tr>
            </thead>
            <tbody>
              {response.length === 0 ? (
                <tr>
                  <td className={styles.noData} colSpan="4">
                    데이터가 없습니다
                  </td>
                </tr>
              ) : (
                response.map((data) => (
                  <tr key={data.memberId}>
                    <td>{data.memberName}</td>
                    <td>{data.completeResultCount}회</td>
                    <td>{data.totalResultCount}회</td>
                    <td>
                      {Math.ceil(
                        (data.completeResultCount / data.totalResultCount) * 100
                      )}
                      %
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default AdminStatistics;
