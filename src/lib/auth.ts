// frontend/src/utils/auth.ts
import axios from "axios";

export const checkAuth = async () => {
  try {
    const response = await axios.get("/auth/user");
    return response.status === 200;
  } catch (error) {
    return false;
  }
};