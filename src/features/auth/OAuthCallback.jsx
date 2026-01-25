import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const access = params.get("access");
    const refresh = params.get("refresh");

    if (access && refresh) {
      localStorage.setItem("access-token", access);
      localStorage.setItem("refresh-token", refresh);
      navigate("/");
    } else {
      navigate("/login");
    }
  }, []);

  return <p>Signing you in with Google…</p>;
}
