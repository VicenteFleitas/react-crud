import { useEffect, useState } from "react";
import axios from "axios";
// import { useSelector } from "react-redux";

const useAxios = () => {
  // const accessToken = useSelector((state) => state.sessionState.access_token);
  const [response, setResponse] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const axiosInstance = axios.create({
    baseURL: "https://cloud.romapy.com",
  });

  // axiosInstance.interceptors.request.use(
  //   (config) => {
  //     config.headers.Authorization = accessToken;
  //     return config;
  //   },
  //   (error) => Promise.reject(error)
  // );
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  let controller = new AbortController();

  useEffect(() => {
    return () => controller?.abort();
  }, []);

  const fetchData = async ({
    url,
    method,
    data = {},
    params = {},
    headers = {},
  }) => {
    setLoading(true);

    controller.abort();
    controller = new AbortController();

    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        signal: controller.signal,
        // headers,
      });
      setResponse(result.data);
      setStatusCode(result.status);
    } catch (error) {
      if (axios.isCancel(error)) {
        // alert that request has been canceled and send error message
      } else {
        setError(error.response ? error.response.data : error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { statusCode, response, error, loading, fetchData };
};

export default useAxios;
