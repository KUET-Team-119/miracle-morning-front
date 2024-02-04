import { useState } from "react";
import axios from "axios";

function useAxiosPatch({ requestData, url }) {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null); // 에러 발생 상태
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태

  const patchData = async () => {
    try {
      const response = await axios.patch(url, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
      });
      setResponseData(response.data);
    } catch (error) {
      setError(error);
      const status = error.response.status;
      if (status === 401) {
        console.log(
          "로그인 시간이 만료되었거나 사용자 정보가 없습니다. 다시 로그인을 시도해주세요."
        );
      } else if (status === 403) {
        console.log("권한이 없습니다.");
      } else if (status === 409) {
        console.log("데이터가 충돌했습니다.");
      } else if (status === 500) {
        console.log("서버에 오류가 발생했습니다. 조금 뒤에 다시 시도해주세요.");
      }
    }
    setIsLoading(false);
  };

  const performPatch = () => {
    patchData();
  };

  return { responseData, error, isLoading, performPatch };
}

export default useAxiosPatch;
