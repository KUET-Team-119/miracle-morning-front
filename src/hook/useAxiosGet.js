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
          Authorization: `Bearer ${sessionStorage.getItem("access-token")}`,
        },
        params: params,
      });
      setResponseData(response.data);
    } catch (error) {
      setError(error);
      const status = error.response.status;
      if (status === 401) {
        console.log(
          "로그인 시간이 만료되었거나 사용자 정보가 없습니다. 다시 로그인을 시도해주세요."
        );
        const authorizationHeader = error.response.headers.authorization;

        // Authorization 헤더가 있는지 확인
        if (authorizationHeader) {
          // Bearer 토큰을 추출
          const accessToken = authorizationHeader.split("Bearer ")[1];
          sessionStorage.setItem("access-token", accessToken);
          try {
            const response = await axios.get(url, {
              headers: {
                Authorization: `Bearer ${sessionStorage.getItem(
                  "access-token"
                )}`,
              },
              params: params,
            });
            setResponseData(response.data);
          } catch (error) {
            setError(error);
            const status = error.response.status;
            if (status === 401) {
              console.log(
                "로그인 시간이 만료되었거나 사용자 정보가 없습니다. 다시 로그인을 시도해주세요."
              );
            }
          }
        }
      } else if (status === 403) {
        console.log("권한이 없습니다.");
      } else if (status === 500) {
        console.log("서버에 오류가 발생했습니다. 조금 뒤에 다시 시도해주세요.");
      }
    }
    setIsLoading(false);
  };

  return { responseData, error, isLoading, refetch: fetchData };
}

export default useAxiosGet;
