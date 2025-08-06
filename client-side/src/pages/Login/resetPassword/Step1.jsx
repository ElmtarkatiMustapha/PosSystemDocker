import { Lang } from "../../../assets/js/lang"
import { ButtonBlue } from "../../../components/ButtonBlue";
import { Player } from '@lottiefiles/react-lottie-player';
import Animation from "../../../assets/notificationAnimation.json"
import { ResetHeader } from "../components/ResetHeader";
import "../../../assets/css/resetPSW/step1.css"
import "../../../assets/css/resetPSW/steps.css"
import { useAppAction, useAppState } from "../../../context/context";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import api from "../../../api/api";
import { APP_NAME } from "../../../assets/js/global";
export function ResetPSWStep1() {
    const state = useAppState();
    const dispatch = useAppAction();
    const navigate = useNavigate();
    const handleClick = () => {
        dispatch({ type: "SET_LOADING", payload: true })
        console.log(state.username)
        //send code
        api({
            method: "post",
            url: "/sendVerCode",
            data: {
                username: state.username,
                email: state.emailAdress
            },
            withCredentials: true
        }).then(res => {
            dispatch({type:"SET_LOADING",payload:false})
            dispatch({ type: "SET_SUCCESS", payload: res.data.message })
            navigate("/login/resetpass/step2",{state:{previewPage:"step1"}});
        }).catch(err => {
            dispatch({ type: "SET_LOADING", payload: false })
            dispatch({ type: "SET_ERROR", payload: err.response.data.message });
        })
    }
    useEffect(() => {
        if (state.currentUser) {
            navigate("/");
        }
        if (!state.username && !state.emailAdress) {
            navigate("/login");
        }
    },[])
    return (
        <div dir={state.currentLang==="ar.json"? "rtl":"ltr"} className="container-fluid p-0 Step">
            <ResetHeader/>
            <div className="row">
                <div className="col-12 animation">
                    {/* the animation here */}
                    <Player
                        autoplay
                        loop
                        src={Animation}
                        style={{width:"7rem"}}
                    ></Player>
                </div>
            </div>
            <div className={state.currentLang==="ar.json"? "row text-end":"row text-start"}>
                <div className="col-12 subTitle h5">
                    <Lang>Get a verification code</Lang>
                </div>
                <div  className="col-12 subText">
                    { APP_NAME}<Lang> will send a verification code to </Lang> <strong> {state.emailAdress} </strong> 
                     <Lang>Standard rates apply</Lang>
                </div>
            </div>
            <div className="row pt-3 pb-3">
                <div className="col-12 btn button">
                    <ButtonBlue type="button" label="Send Code" handleClick={handleClick} />
                </div>
            </div>
        </div>
    )
}