import { ResetHeader } from "../components/ResetHeader";
import "../../../assets/css/resetPSW/steps.css"
import "../../../assets/css/resetPSW/step2.css"
import { ButtonBlue } from "../../../components/ButtonBlue";
import { Lang } from "../../../assets/js/lang";
import { motion } from "framer-motion";
import { useAppAction, useAppState } from "../../../context/context";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../../api/api";

export function ResetPSWStep2() {
    const state = useAppState()
    const dispatch = useAppAction()
    const [code, setCode] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const handleResent = () => {
        dispatch({ type: "RESTAR_RESENT_COUNTER" })
        startCount();
        api({
            method: "post",
            url: "/sendVerCode",
            data: {
                username: state.username,
                email: state.emailAdress
            },
            withCredentials: true
        }).then(res => {
            dispatch({ type: "SET_SUCCESS", payload: res.data.message })
        }).catch(err => {
            dispatch({ type: "SET_ERROR", payload: err.response.data.message });
        })
    }
    const startCount = ()=>{
         const codeSetInterval = setInterval(() => {
                if (state.counterResent >= 0) {
                    dispatch({ type: "DEC_RESENT_COUNTER" });
                }
        }, 1000)
        setTimeout(() => {
            clearInterval(codeSetInterval)
        }, 1000 * 62);
    }
    function handleSubmit() {
        api({
            method: "post",
            url: "/validateCode",
            data: {
                username: state.username,
                code: code
            },
            withCredentials: true
        }).then(res => {
            dispatch({ type: "SET_SUCCESS", payload: res.data.message })
            dispatch({ type: "SET_USER", payload: res.data.user });
            dispatch({ type: "SET_ROLES", payload: res.data.roles});
            const token = res.data.token;
            localStorage.setItem("auth_token", token);
            // Set it in the default Axios headers
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            navigate("/login/resetpass/step3")
        }).catch(err => {
            dispatch({type:"SET_ERROR",payload: err.response.data.message})
        })
    }
    useEffect(() => {
        startCount();
        if (state.currentUser) {
            navigate("/");
        }
        if (!state.username || !state.emailAdress) {
            navigate("/login");
        }
        if (location.state === null || (typeof location.state.previewPage)=== "undefined" ) {
            navigate("/login/resetpass");
        }
    }, [])
    return (
        <form className="container-fluid step">
            <ResetHeader />
            <div className={state.currentLang==="ar.json"? "row pt-3 text-end":"row pt-3 text-start"}>
                <div className="col-12 subPara">
                    <Lang>A mail with a 6-digit verification code was just sent to</Lang> <strong>{state.emailAdress}</strong>
                </div>
            </div>
            <div className="row">
                <div className="col-12 ps-2 pe-2 pt-3 pb-2">
                    <motion.input
                        required
                        className="form-control form-control-lg"
                        type="text"
                        name="userName"
                        placeholder={"Ex: 020202"}
                        whileFocus={{ scale: 1.05 }}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </div>
            </div>
            <div className="row text-start">
                <div className="col-12 resent">
                    {state.counterResent <=0 ?<button onClick={handleResent} role="button"><Lang>Resend</Lang></button> : <button disabled style={{opacity:0.5,cursor: "not-allowed" }} role="button"><Lang>Please Wait</Lang> </button>}
                    
                    <strong className="counter p-2">{ state.counterResent}</strong>
                </div>
            </div>
            <div className="row pt-3 pb-3">
                <div className="col-12  text-end">
                    <ButtonBlue disabled={code.length === 6?false:true} type="button" label="Next" handleClick={handleSubmit} />
                </div>
            </div>
        </form>
    )
}