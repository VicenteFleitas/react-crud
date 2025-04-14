import { useEffect, useState } from "react";

const BASE_URL = "https://cloud.romapy.com";

const useFetch = () => {
  const accessToken = window.sessionStorage.getItem("access_token");
  const [response, setResponse] = useState(null);
  const [statusCode, setStatusCode] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = async ({
    url,
    method,
    body = {},
    params = {},
    headers = {},
  }) => {
    setLoading(true);

    try {
      //   const params = new URLSearchParams();
      //   params.append("username", "example");
      const options = { method, headers };
      if (method === "POST") options.body = JSON.stringify(body);
      let myUrl = BASE_URL + url;
      if (JSON.stringify(params) !== "{}") myUrl += params;
      const result = await fetch(`${myUrl}`, options);
      if (!result.ok) {
        setStatusCode(result.status);
        throw new Error(`Response status: ${result.status}`);
      }
      setStatusCode(result.status);
      const json = await result.json();
      setResponse(json);
    } catch (error) {
      console.log(error);
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  return { statusCode, response, error, loading, fetchData };
};

export default useFetch;
