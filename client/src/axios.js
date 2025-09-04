import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:5000/api", // 👈 your backend base URL
    withCredentials: true, // only if you are using cookies/sessions
});

export default instance;
