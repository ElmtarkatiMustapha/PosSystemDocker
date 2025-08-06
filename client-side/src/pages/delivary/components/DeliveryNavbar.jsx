import { FaHouse, FaSackDollar, FaUsers } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Lang } from "../../../assets/js/lang";
import { useAppState } from "../../../context/context";
import { ProfileMenu } from "../../../components/ProfileMenu";
import { Picture } from "../../dashboard/components/Picture";
import { APP_NAME } from "../../../assets/js/global";
import Logo from "../../../assets/logo.png";

export function DeliveryNavbar() {
    const appState = useAppState();
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
                            <img  src={Logo} alt="" className="logo" />
                            <span className="title">{APP_NAME }</span>
                        </Link>
                    </div>
                    <div className="col-8 text-end p-1 ">
                        <ClientsBtn />
                        <CachierBtn />
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

function CachierBtn() {
    const state = useAppState();
    if (state.userRoles.includes("cachier") || state.userRoles.includes("admin")) {
        return (
            <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                <Link to={"/pos"} style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    <FaSackDollar fontSize={"1.7rem"} color="white" />
                    <span className="ps-2 pe-2"><Lang>Pos</Lang></span>
                </Link>
            </div>
        )
    } else {
        return "";
    }
    
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
    } else if(state.userRoles.includes("cachier")){
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