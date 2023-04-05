import axios from "axios";

export const revokeLinearToken = async (token: string) => {
  try {
    const res = await axios.post(
      'https://api.linear.app/oauth/revoke',
      {},
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    );
  } catch (error: any) {
    console.error("Error doing 'revokeLinearToken", error);
  }
};
