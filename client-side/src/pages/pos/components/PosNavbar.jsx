import { FaCircleUser, FaUsers,FaTruckFast, FaSackDollar } from "react-icons/fa6";
import { LangSelect } from "../../dashboard/components/LangSelect";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../../assets/logo.png";
import { useAppState } from "../../../context/context";
import { FaHouse } from "react-icons/fa6";
import { Lang } from "../../../assets/js/lang";
import { APP_NAME } from "../../../assets/js/global";
import { Picture } from "../../dashboard/components/Picture";
import { ProfileMenu } from "../../../components/ProfileMenu";
/**
 * create pos navbar components 
 * @returns jsx component
 */
export function PosNavbar() {
    const appState = useAppState();
    const location = useLocation();
    return (
        <>
            <div className="container-fluid  position-fixed top-0 z-1 "
                style={{
                    backdropFilter: "blur(14px)",
                    backgroundColor: "#ffffff1a"
                }}          
            >
                <div className="row align-items-center">
                    <div className="col-4">
                        <Link to="/" className="brand">
                            <img  src={Logo} alt="" className="logo" fetchPriority="high" />
                            <span className="title">{APP_NAME }</span>
                        </Link>
                    </div>
                    <div className="col-8 text-end p-1 ">
                        {
                            location.pathname == "/pos/customers" ?
                            <PosBtn />
                            :
                            <ClientsBtn />
                        }
                        <DeliveryBtn />
                        <DashboardBtn/> 
                        
                        <div style={{ verticalAlign: "middle" }} className="d-inline-block p-1">
                            <button className="border-0 m-0 p-0 bg-transparent" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                                <Picture  picture={appState.currentUser.picture? appState.currentUser.picture:"defaultProfile.jpg" } />
                            </button>
                            
                            {/* <Link onClick={handleProfileMenu}  to={"/profile"}>
                                <Picture  picture={appState.currentUser.picture? appState.currentUser.picture:"defaultProfile.jpg" } />
                            </Link> */}
                        </div>
                    </div>
                </div>
            </div>
            <ProfileMenu/>
        </>
    )
}

function ClientsBtn() {
    const state = useAppState();
    if (state.userRoles.includes("manager") || state.userRoles.includes("admin")) {
        return (
            <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                <Link to={"/customers"} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaUsers fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>Clients</Lang></span>
                </Link>
            </div>
        )
    } else {
        return (
            <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                <Link to={"/pos/customers"} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaUsers fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>Clients</Lang></span>
                </Link>
            </div>
        )
    }
}

/**
 * check if the user has the access to cachier part
 * @return delivery button
 */
function DeliveryBtn() {
    const state = useAppState();
    if (state.userRoles.includes("delivery") || state.userRoles.includes("admin")) {
        return (
            <div style={{ verticalAlign: "middle" }}
                className="d-inline-block p-1"
            >
                <Link to={"/delivery"} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaTruckFast fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>Delivery</Lang></span>
                </Link>
            </div>
        )
    } else {
        return "";
    }
}
/**
 * check if the user has the access to delivery part
 * @return delivery button
 */
function DashboardBtn() {
    const state = useAppState();
    if (state.userRoles.includes("manager") || state.userRoles.includes("admin")) {
        return (
            <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                <Link to={"/"} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "600",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaHouse fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>Dashboard</Lang></span>
                </Link>
            </div>
        )
    } else {
        return "";
    }
    
}
function PosBtn({ handleClick }) {
    return (
        <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
            <Link to={"/"} style={{
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