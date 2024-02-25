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
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      });
      setResponseData(response.data);
    } catch (error) {
      setError(error);
      const status = error.response.status;
      if (status === 401) {
        const authorizationHeader = error.response.headers.authorization;

        // Authorization 헤더가 있는지 확인
        if (authorizationHeader) {
          // 새로운 accessToken 토큰을 추출
          const accessToken = authorizationHeader.split("Bearer ")[1];
          localStorage.setItem("access-token", accessToken);
          try {
            const response = await axios.patch(url, requestData, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
            });
            setResponseData(response.data);
          } catch (error) {
            setError(error);
          }
        }
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
