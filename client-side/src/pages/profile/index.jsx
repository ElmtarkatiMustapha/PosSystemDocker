import { useAppState } from "../../context/context"
import ProfileContext from "../../context/profileContext";
import { DashboardNavbar } from "../dashboard/components/DashboardNavbar";
import { MobileNavbar } from "../dashboard/components/mobile/MobileNavbar";
import { MobileSidebar } from "../dashboard/components/mobile/MobileSidebar";
import { Sidebar } from "../dashboard/components/Sidebar";
import { DeliveryNavbar } from "../delivary/components/DeliveryNavbar";
import { MobileDeliveryNavbar } from "../delivary/components/mobile/MobileDeliveryNavbar";
import { MobilePosNavbar } from "../pos/components/mobile/MobilePosNavbar";
import { PosNavbar } from "../pos/components/PosNavbar";
import { ProfileContent } from "./components/ProfileContent";

export function Profile() {
    
    return (
        <>
            <ProfileContext>
                <ProfileNavBar />
                <ProfileContent/>
            </ProfileContext>
        </>
    )
}

function ProfileNavBar() {
    const appState = useAppState();
    if (appState.userRoles.includes("admin") || appState.userRoles.includes("manager")) {
        return (
            <>
                {!appState.isMobile && <DashboardNavbar />}
                {!appState.isMobile && <Sidebar />}
                {appState.isMobile && <MobileNavbar />}
                {appState.isMobile && <MobileSidebar />}
            </>
        )
    } else if (appState.userRoles.includes("cachier")) {
        return (
            <>
                {!appState.isMobile && <PosNavbar />}
                {appState.isMobile && <MobilePosNavbar/>}
            </>
        )
    } else if (appState.userRoles.includes("delivery")) {
        return (
            <>
                {!appState.isMobile && <DeliveryNavbar />}
                {appState.isMobile && <MobileDeliveryNavbar/>}
            </>
        )
    }
}