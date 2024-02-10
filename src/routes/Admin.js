import useDecodingJwt from "../hook/useDecodingJwt";

function Admin() {
  const { myName } = useDecodingJwt();
  return (
    <>
      <h4>🔧 미라클 모닝 관리자 페이지</h4>
      <p>
        관리자 <span style={{ color: "#69973A" }}>{myName}</span>님 환영합니다.
      </p>
    </>
  );
}

export default Admin;
