import { Lang } from "../../../assets/js/lang"
import { FaCircleUser } from "react-icons/fa6"
import logo from "../../../assets/logo.png" 
import { useAppState } from "../../../context/context"
export function ChangePassHeader() {
    const state = useAppState();
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <img style={{width: "5rem"}} className="logo" src={logo} alt="" />
                </div>
            </div>
            <div className="row p-3">
                <div className="col-12 title h2">
                    <Lang>Reset Password</Lang>
                </div>
            </div>
            <div className="row ">
                <div className="col-12 userName">
                    <div className="userNameBox">
                        <FaCircleUser className="icon"/>
                        <span className="text"><Lang>UserName</Lang> :{ state.currentUser.username }</span>
                    </div>
                </div>
            </div>
        </>
    )
}