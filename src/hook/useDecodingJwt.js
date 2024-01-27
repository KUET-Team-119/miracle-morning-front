import base64 from "base-64";
import utf8 from "utf8";

function useDecodingJwt() {
  // sessionStorage에서 "access-token" 키로 저장된 JWT 가져오기
  const jwt = sessionStorage.getItem("access-token");

  let myId = null;
  let myName = null;
  let myRoles = null;
  let myExp = null;

  // JWT가 없으면 null 반환
  if (!jwt) {
    return { myId, myName, myRoles, myExp };
  }

  // Jwt 디코딩
  const payload = jwt.split(".")[1];
  const decodingInfo = base64.decode(payload);
  const decodingInfoUtf8 = utf8.decode(decodingInfo);
  const decodingInfoJson = JSON.parse(decodingInfoUtf8);
  myId = decodingInfoJson.id;
  myName = decodingInfoJson.sub;
  myRoles = decodingInfoJson.roles;
  myExp = decodingInfoJson.exp;

  return { myId, myName, myRoles, myExp };
}

export default useDecodingJwt;
