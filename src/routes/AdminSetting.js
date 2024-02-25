import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPost from "../hook/useAxiosPost";
import useDecodingJwt from "../hook/useDecodingJwt";
import AdminMenu from "../components/AdminMenu";
import styles from "../css/AdminSetting.module.css";
import homeIcon from "../images/home.png";
import menuIcon from "../images/menu.png";
import { Button, Card, Form, Modal, Toast } from "react-bootstrap";

function AdminSetting() {
  const { myName } = useDecodingJwt();
  const [complaintContent, setComplaintContent] = useState("");
  const [menuShow, setMenuShow] = useState(false);
  const [requestData, setRequestData] = useState("");
  const [complaintModalShow, setComplaintModalShow] = useState(false);
  const [postToastShow, setPostToastShow] = useState(false);
  const navigate = useNavigate();

  const goToMemberManaging = () => {
    navigate("/admin/membermanaging");
  };

  // 데이터 객체를 json 형태로 변환
  const objToJson = () => {
    setRequestData(
      JSON.stringify({
        memberName: myName,
        content: complaintContent,
      })
    );
  };

  // json 데이터를 서버로 전송
  const submitPost = (e) => {
    e.preventDefault();
    performPost();
  };
  // 오류 제보
  const {
    responseData: responseDataPost,
    error: errorPost,
    isLoading: isLoadingPost,
    performPost,
  } = useAxiosPost({
    url: `/api/complaint`,
    requestData,
  });
  useEffect(() => {
    if (!isLoadingPost) {
      if (responseDataPost !== null) {
        closeComplaintModal();
        setPostToastShow(true);
      } else {
        closeComplaintModal();
      }
    }
  }, [responseDataPost, errorPost, isLoadingPost]);

  // 오류 제보 입력 시 input의 value 변경
  const changeComplaintContent = (e) => {
    setComplaintContent(e.target.value);
  };

  // 오류 제보 모달 열기
  const openComplaintModal = () => {
    setComplaintModalShow(true);
  };

  // 오류 제보 모달 닫기
  const closeComplaintModal = () => {
    setComplaintModalShow(false);
    setComplaintContent("");
  };

  const complaintIsValid = complaintContent !== "";

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
            <p>⚙️ 설정</p>
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
        <div className={styles.settingContainer}>
          <Card
            body
            className={styles.settingCard}
            onClick={openComplaintModal}
          >
            오류 제보
          </Card>
        </div>
      </div>
      <Modal show={complaintModalShow} centered>
        <Form onSubmit={submitPost}>
          <Modal.Body className={styles.complaintModalBody}>
            <p className={styles.complaintModalBodyTitle}>
              아래에 오류를 적어주세요.
            </p>
            <Form.Control
              as="textarea"
              placeholder="내용을 작성해주세요. (700자 이내)"
              rows={5}
              value={complaintContent}
              onChange={changeComplaintContent}
              maxLength={700}
            />
          </Modal.Body>
          <Modal.Footer className={styles.modalFooter}>
            <Button
              type="button"
              variant="secondary"
              onClick={closeComplaintModal}
            >
              취소
            </Button>
            <Button
              className={styles.submitBtn}
              type="submit"
              disabled={complaintIsValid ? false : true}
              onClick={objToJson}
            >
              전송
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Toast
        className={styles.toast}
        show={postToastShow}
        onClose={() => setPostToastShow(false)}
        delay={3000}
        autohide
      >
        <Toast.Body>오류 제보가 전송되었습니다.</Toast.Body>
      </Toast>
    </>
  );
}

export default AdminSetting;
