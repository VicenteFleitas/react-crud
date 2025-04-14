import React, { useEffect } from "react";
import PKCE from "js-pkce";
import pkceChallenge from "pkce-challenge";

const Oauth = () => {
  const handlePkce = async () => {
    const { code_verifier } = await pkceChallenge(43);

    const pkce = new PKCE({
      client_id: import.meta.env.VITE_CLIENT_ID,
      redirect_uri: "https://localhost:3000/callback",
      authorization_endpoint: "https://cloud.romapy.com/oauth2/authorize",
      token_endpoint: "https://cloud.romapy.com/oauth2/token",
      requested_scopes: "*",
    });
    const additionalParams = {
      response_type: "code",
      state: "abc",
      scope: "READ WRITE",
    };
    pkce.setCodeVerifier(code_verifier);
    window.location.replace(pkce.authorizeUrl(additionalParams));
  };

  useEffect(() => {
    handlePkce();
  }, []);

  return <div>index</div>;
};

export default Oauth;
