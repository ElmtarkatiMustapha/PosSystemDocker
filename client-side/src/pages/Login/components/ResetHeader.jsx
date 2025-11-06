import { Lang } from "../../../assets/js/lang"
import { FaCircleUser } from "react-icons/fa6"
import logo from "../../../assets/logo.png" 
import { useAppState } from "../../../context/context"
import { APP_NAME } from "../../../assets/js/global";
export function ResetHeader() {
    const state = useAppState();
    return (
        <>
            <div className="row">
                <div className="col-12">
                    <img style={{width: "5rem"}} className="logo" src={logo} alt="" fetchPriority="high" />
                </div>
            </div>
            <div className="row p-3">
                <div className="col-12 title h2">
                    <Lang>Account Recovery</Lang>
                </div>
                <div className="col-12 para">
                    <Lang>To help keep your account safe, we wants to make sure that it's really you trying to sign in</Lang>
                </div>
            </div>
            <div className="row ">
                <div className="col-12 userName">
                    <div className="userNameBox">
                        <FaCircleUser className="icon"/>
                        <span className="text"><Lang>UserName</Lang> :{ state.username }</span>
                    </div>
                </div>
            </div>
        </>
    )
}