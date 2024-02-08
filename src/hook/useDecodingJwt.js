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

  const urlBase64Decode = (str) => {
    // Base64 URL 디코딩
    const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    // Base64 디코딩 후 UTF-8 디코딩
    const decoded = atob(base64);
    const utf8 = decodeURIComponent(
      Array.from(decoded)
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return utf8;
  };

  // Jwt 디코딩
  const payload = jwt.split(".")[1];
  const decodingInfo = urlBase64Decode(payload);
  const decodingInfoJson = JSON.parse(decodingInfo);
  myId = decodingInfoJson.id;
  myName = decodingInfoJson.sub;
  myRoles = decodingInfoJson.roles;
  myExp = decodingInfoJson.exp;

  return { myId, myName, myRoles, myExp };
}

export default useDecodingJwt;
