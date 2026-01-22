import axios from "axios";   // ✅ correct
import configs from "../utils/configs";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${configs.BASEURL}/user/signin`,
      { email, password }
    );

    console.log("LOGIN RESPONSE 👉", response.data);

    if (response.data.status === "success") {
      await saveToken(response.data.data.token);
    }

    return response.data;
  } catch (err) {
    console.log("LOGIN ERROR 👉", err.response || err.message);

    return {
      status: "error",
      error: err.response?.data?.error || "Server not reachable",
    };
  }
};
