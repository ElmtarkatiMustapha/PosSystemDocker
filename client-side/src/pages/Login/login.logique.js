import api from "../../api/api";
import { useAppAction } from "../../context/context";
import axios from "axios";
export function Login(username, password) {
    const dispatch = useAppAction();
    axios({
        method: "post",
        url: "/login",
        data: {
            username: username,
            password:password
        },
        // withCredentials:true
    }).then((res) => {
        dispatch({ action: "SET_SUCCESS",payload:res?.data?.message });
        dispatch({ action: "SET_USER",payload:res?.data?.user });

        const token = res.data.token;
        localStorage.setItem("auth_token", token);
        // Set it in the default Axios headers
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }).catch((err) => {
        dispatch({ action: "SET_ERROR", payload: err?.response?.data?.message });
    })

}