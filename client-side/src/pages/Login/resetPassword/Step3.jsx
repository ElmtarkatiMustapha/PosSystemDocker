import { useState } from "react";
import { Lang } from "../../../assets/js/lang";
import { ResetHeader } from "../components/ResetHeader";
import { motion } from "framer-motion";
import { ButtonBlue } from "../../../components/ButtonBlue";
import { useAppAction, useAppState } from "../../../context/context";
import { useNavigate } from "react-router-dom";
import { ChangePassHeader } from "../components/ChangePassHeader";
import api from "../../../api/api";
import { ButtonDanger } from "../../../components/ButtonDanger";
export function ResetPSWStep3() {
    const [password, setPassword] = useState();
    const [passwordConf, setPasswordConf] = useState();
    const dispatch = useAppAction();
    const state = useAppState();
    const navigate = useNavigate();

    const handlePass = (e) => {
        setPassword(e.target.value)
    }
    const handlePassCon = (e) => {
        setPasswordConf(e.target.value)
    }
    const handleGoBack = (e)=>{
        navigate(-1);
    }
    function handleSubmit() {
        if (password === passwordConf) {
            api({
                url: "/resetPassword",
                method: "post",
                data: {
                    username: state.username,
                    password: password
                },
                withCredentials: true
            }).then(res => {
                dispatch({ type: "SET_SUCCESS", payload: res.data.message });
                // dispatch({ type: "SET_USER", payload: res.data.user });
                // dispatch({ type: "SET_ADMIN", payload: res.data.user.role === "admin" ? true : false });
                navigate("/");
            }).catch(err => {
                dispatch({ type: "SET_ERROR", payload: err.response.data.message});
            })
        } else {
            dispatch({ type: "SET_ERROR", payload: "Passwords not equels" });
        }
    }
    return (
        <form action="" className="container-fluid">
            <ChangePassHeader/>
            <div className="row p-4">
                <div className="col-12 title h4 text-start">
                    <Lang>Enter a new password</Lang>
                </div>
                <div className="col-12 p-2">
                    <motion.input
                        required
                        className="form-control form-control-lg"
                        type="password"
                        name="password"
                        onChange={handlePass}
                        placeholder={Lang({ children: "New Password" })}
                        whileFocus={{scale:1.05}}
                    />
                </div>
                <div className="col-12 p-2">
                    <motion.input
                        required
                        className="form-control form-control-lg"
                        type="password"
                        name="passwordConf"
                        onChange={handlePassCon}
                        placeholder={Lang({ children: "Retype new Password" })}
                        whileFocus={{scale:1.05}}
                    />
                </div>
            </div>
            <div className="row pt-3 pb-3">
                <div className="col-12  text-start">
                    <ButtonDanger type="button" label="Back" handleClick={handleGoBack} />
                </div>
                <div className="col-12  text-end">
                    <ButtonBlue type="button" label="Finish" handleClick={handleSubmit} />
                </div>
            </div>

        </form>
    )
}