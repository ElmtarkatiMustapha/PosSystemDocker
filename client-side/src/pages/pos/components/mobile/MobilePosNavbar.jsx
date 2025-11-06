import { FaCircleUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Logo from "../../../../assets/logo.png";
import { BsGridFill, BsXLg } from "react-icons/bs";
import { useState } from "react";
import { MobilePosNavbarContent } from "./MobilePosNavbarContent";
import { AnimatePresence } from "framer-motion";
import { MobileCart } from "./MobileCart";
import { APP_NAME } from "../../../../assets/js/global";
import { Picture } from "../../../dashboard/components/Picture";
import { useAppState } from "../../../../context/context";
import { ProfileMenu } from "../../../../components/ProfileMenu";
/**
 * create pos navbar components 
 * @returns jsx component
 */
export function MobilePosNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCart, setIsCart] = useState(false);
    const appState = useAppState();
    const handleClick = () => {
        setIsOpen(!isOpen)
        setIsCart(false);
    }
    const handleCart = () => {
        setIsCart(!isCart);
    }
    return (
        <>
        <div className="container-fluid  position-fixed top-0 z-1 "
            style={{
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter:"blur(14px)",
                backgroundColor: "#ffffff1a"
            }}          
        >
            <div className="row align-items-center">
                <div className="col-8">
                    <Link to="/" className="brand">
                        <img  src={Logo} alt="" className="logo" fetchPriority="high" />
                            <span className="title">{ APP_NAME}</span>
                    </Link>
                </div>
                <div className="col-4 text-end p-1 ">
                    <div style={{ verticalAlign: "middle" }} className="d-inline-block p-1">
                        <button className="border-0 m-0 p-0 bg-transparent" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
                            <Picture  picture={appState.currentUser.picture? appState.currentUser.picture:"defaultProfile.jpg" } />
                        </button>
                        {/* <Link to={"/profile"}>
                            <FaCircleUser fontSize={"2.7rem"} color="#5C5C68" />
                        </Link> */}
                    </div>
                </div>
            </div>
            </div>
            <AnimatePresence>
                {isOpen && isCart ?
                <MobileCart handleCart={handleClick} />
                :
                isOpen &&
                <MobilePosNavbarContent handleCart={handleCart} />
            }
        </AnimatePresence>
        <div className="mobile-sidebar-open-btn position-fixed z-3">
            <button onClick={handleClick} className="btn">
                {!isOpen && <BsGridFill />}
                {isOpen && <BsXLg />}
            </button>
        </div>
        <ProfileMenu/>
        </>
    )
}

