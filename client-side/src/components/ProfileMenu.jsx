import { Link, useLocation } from "react-router-dom";
import api, { getImageURL } from "../api/api";
import { Lang } from "../assets/js/lang";
import { useAppAction, useAppState } from "../context/context";
import { FaHome, FaUser } from "react-icons/fa";
import { FaBagShopping, FaPowerOff, FaSackDollar, FaTruckFast } from "react-icons/fa6";
import { LangSelect } from "../pages/dashboard/components/LangSelect";

export function ProfileMenu() {
    const appState = useAppState()
    const location = useLocation();
    const handleClose = (e) => {
        let closeBtn = document.getElementById("closeProfileMenu")
        closeBtn.click()
    }
    return (
        <div className="offcanvas offcanvas-end" data-bs-backdrop="static" tabIndex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
            <div className="offcanvas-header">
                {/* <h3 className="offcanvas-title h3 " id="offcanvasRightLabel"> <Lang>Hello!!</Lang> </h3> */}
                <button id="closeProfileMenu" type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
                <div className="picture d-flex justify-content-center pb-2">
                    <div
                        style={{
                            backgroundImage:"url("+ getImageURL(appState.currentUser?.picture? appState.currentUser?.picture :"defaultProfile.jpg" )+")",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            height: "13rem",
                            width: "13rem"
                        }}
                        className="bg-image rounded-circle position-relative">
                    </div>
                </div>
                <div className="p-1">
                    <div style={{
                        borderRadius: "8px",
                    }} className=" p-1 text-center ">
                        <div className="title h5 fst-italic text-body-secondary text-decoration-underline fw-semibold">{appState.currentUser?.name}</div>
                    </div>
                </div>
                <HomeBtn handleClick={handleClose}/>
                {
                    (appState.userRoles.includes("admin") || appState.userRoles.includes("cachier") || appState.userRoles.includes("delivery")) &&
                        (location.pathname == "/pos/sales" || location.pathname == "/delivery/sales") ?
                        (appState.userRoles.includes("admin") || appState.userRoles.includes("cachier")) ? 
                            <PosSaleBtn handleClick={handleClose}/>
                            :
                            <Delivery handleClick={handleClose}/>
                        :
                        <SalesBtn handleClick={handleClose} />
                }

                <ProfileBtn handleClick={handleClose} />
                <div style={{verticalAlign:"middle"}} className="p-1 text-center">
                    <LangSelect />
                </div>
                <LogoutBtn handleClick={handleClose}/>
            </div>
        </div>
    )
}
function SalesBtn({handleClick}) {
    const state = useAppState();
    if (state.userRoles.includes("admin")) {
        return (
            <>
                <div style={{verticalAlign:"middle"}} className="p-1 text-center">
                    <Link to={"/Sales"} onClick={handleClick} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                    }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                        <FaBagShopping fontSize={"1.7rem"} color="white" />
                        <span className="ps-2 pe-2"><Lang>Sales</Lang></span>
                    </Link>
                </div>
            </>
        )
    } else if(state.userRoles.includes("cachier")) {
        return (
            <div style={{verticalAlign:"middle"}} className="p-1 text-center">
                <Link to={"/pos/sales"} onClick={handleClick} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaBagShopping fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>Sales</Lang></span>
                </Link>
            </div>
        )
    } else if (state.userRoles.includes("delivery")) {
        return (
            <div style={{verticalAlign:"middle"}} className="p-1 text-center">
                <Link to={"/delivery/sales"} onClick={handleClick} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaBagShopping fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>Delivered Orders</Lang></span>
                </Link>
            </div>
        )
    }
}
function ProfileBtn({handleClick}) {
    return (
        <div style={{verticalAlign:"middle"}} className="p-1 text-center">
            <Link to={"/profile"} onClick={handleClick} style={{
                    borderRadius: "29px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
            }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                <FaUser fontSize={"1.7rem"} color="white" />
                <span className="ps-2 pe-2"><Lang>Profile</Lang></span>
            </Link>
        </div>
    )
}
function HomeBtn({handleClick}) {
    return (
        <div style={{verticalAlign:"middle"}} className="p-1 text-center">
            <Link to={"/"} onClick={handleClick} style={{
                    borderRadius: "29px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
            }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                <FaHome fontSize={"1.7rem"} color="white" />
                <span className="ps-2 pe-2"><Lang>Home</Lang></span>
            </Link>
        </div>
    )
}
function LogoutBtn({ handleClick }) {
    const appAction = useAppAction();
    /**
     * @desc handle logout 
     * @todo send request to server-side
     * @todo run handleClick function
     * @todo navigate to login page
     */
    const handlelogout = (e) => {
        e.preventDefault()
        api({
            method: "get",
            url: "/logout"
            // withCredentials:true
        }).then(res => {
            handleClick()
            location.reload()
        }).catch(err => {
            //handle error
            appAction({ type: "SET_ERROR", payload: err?.response?.data?.message });

        })
    }
    return (
        <div style={{verticalAlign:"middle"}} className="p-1 text-center">
            <Link  onClick={handlelogout} style={{
                    borderRadius: "29px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
            }} className="btn pt-1 pb-1 ps-2 pe-2 btn-danger">
                <FaPowerOff fontSize={"1.7rem"} color="white" />
                <span className="ps-2 pe-2"><Lang>Logout</Lang></span>
            </Link>
        </div>
    )
}
function PosSaleBtn({ handleClick }) {
    return (
        <div style={{verticalAlign:"middle"}} className="p-1 text-center">
            <Link to={"/pos"} onClick={handleClick} style={{
                    borderRadius: "29px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
            }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                <FaSackDollar fontSize={"1.7rem"} color="white" />
                <span className="ps-2 pe-2"><Lang>Pos</Lang></span>
            </Link>
        </div>
    )
}

function Delivery({handleClick}) {
    return (
        <div style={{verticalAlign:"middle"}} className="p-1 text-center">
            <Link to={"/delivery"} onClick={handleClick} style={{
                    borderRadius: "29px",
                    fontSize: "1.1rem",
                    fontWeight: "600",
            }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                <FaTruckFast fontSize={"1.7rem"} color="white" />
                <span className="ps-2 pe-2"><Lang>Delivery</Lang></span>
            </Link>
        </div>
    )
} 