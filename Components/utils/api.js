// utils / api.js;
import axios from "axios";

const api = axios.create({
  baseURL: "https://668dde68bf9912d4c92c0fc3.mockapi.io/Khangdase171370",
});

export const getPlayers = () => api.get("/");
export const updatePlayer = (id, data) => api.put(`/${id}`, data);
export const deletePlayer = (id) => api.delete(`/${id}`);

export default api;
// import axios from "axios";

// export const fetchTeachers = async () => {
//   try {
//     const response = await axios.get(
//       "https://66908916c0a7969efd9c67ed.mockapi.io/ojt-repo/AllInstructor"
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching teachers:", error);
//     return [];
//   }
// };
