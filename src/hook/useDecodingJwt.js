import base64 from "base-64";
import utf8 from "utf8";

function useDecodingJwt() {
  // sessionStorage에서 "access-token" 키로 저장된 JWT 가져오기
  const jwt = sessionStorage.getItem("access-token");

  // JWT가 없으면 null 반환
  if (!jwt) {
    return null;
  }

  // Jwt 디코딩
  const payload = jwt.split(".")[1];
  const decodingInfo = base64.decode(payload);
  const decodingInfoUtf8 = utf8.decode(decodingInfo);
  const decodingInfoJson = JSON.parse(decodingInfoUtf8);

  return decodingInfoJson.sub;
}

export default useDecodingJwt;
