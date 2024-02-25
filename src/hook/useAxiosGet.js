import { useState, useEffect } from "react";
import axios from "axios";

function useAxiosGet({ url, params }) {
  const [responseData, setResponseData] = useState(null); // api 데이터 저장
  const [error, setError] = useState(null); // 에러 발생 상태
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태

  useEffect(() => {
    fetchData();
  }, [url]);

  const fetchData = async () => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
        params: params,
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
            const response = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
              },
              params: params,
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

  return { responseData, error, isLoading, refetch: fetchData };
}

export default useAxiosGet;
