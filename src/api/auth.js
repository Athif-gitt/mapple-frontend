import axios from "axios";

export const oauthLogin = async (username, password) => {
  const data = new URLSearchParams({
    grant_type: "password",
    username,
    password,
    client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
    client_secret: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
  });

  const res = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/o/token/`,
    data,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data;
};
