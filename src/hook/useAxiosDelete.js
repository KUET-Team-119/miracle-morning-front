import { useState } from "react";
import axios from "axios";

function useAxiosDelete({ url, password }) {
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null); // 에러 발생 상태
  const [isLoading, setIsLoading] = useState(true); // 데이터 로딩 상태

  const deleteData = async () => {
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          Password: `${password}`,
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
            const response = await axios.delete(url, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access-token")}`,
                Password: `${password}`,
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

  const performDelete = () => {
    deleteData();
  };

  return { responseData, error, isLoading, performDelete };
}

export default useAxiosDelete;
