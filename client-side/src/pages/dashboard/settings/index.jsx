import { Lang } from "../../../assets/js/lang";
import { useAppAction, useAppState } from "../../../context/context";
import { useSettingsAction, useSettingsState } from "../../../context/settingsContext";
import { Picture } from "../components/Picture";
import { AlertPart } from "./components/AlertPart";
import { BusinessModal } from "./components/modals/BusinessModal";
import { BusinessPart } from "./components/BusinessPart";
import { PosPart } from "./components/PosPart";
import { PrintersPart } from "./components/PrintersPart";
import { AlertModal } from "./components/modals/AlertModal";
import { PosModal } from "./components/modals/PosModal";
import { AddPrinter } from "./components/modals/AddPrinter";
import { useEffect } from "react";
import api from "../../../api/api";

export function Settings() {
    const appAction = useAppAction();
    const settingsState = useSettingsState();
    const settingsAction = useSettingsAction(); 
    useEffect(() => {
        api({
            method: "get",
            url: "/settings",
            // withCredentials:true
        }).then(res => {
            return res.data
        }).then(res => {
            settingsAction({
                type: "SET_SETTINGS",
                payload: res.data
            })
            settingsAction({
                type: "SET_LOADING",
                payload: false
            })
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            settingsAction({
                type: "SET_LOADING",
                payload: false
            })
        })
    }, [])
    return (
        <>
            <div className="container-fluid p-2">
                <div className="row m-0 p-2">
                    <div className="col-12 headerPage p-2 container-fluid">
                        <div className="row m-0 justify-content-between">
                            <div className={"col-5 h2 align-content-center "}><Lang>Settings</Lang></div>
                            <div className="col-7 text-end">
                                <div style={{ verticalAlign: "middle" }} className="d-inline-block p-1">
                                    <Picture  picture={settingsState?.settings?.businessInfo?.logo? settingsState?.settings?.businessInfo?.logo : "defaultProfile.jpg" } />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row m-0 ">
                    <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                        <BusinessPart/>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                        <AlertPart/>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                        <PosPart/>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4 p-2">
                        <PrintersPart/>
                    </div>
                </div>
            </div>
            {/* modals */}
            {settingsState.businessModal && <BusinessModal/>}
            {settingsState.alertModal && <AlertModal/>}
            {settingsState.posModal && <PosModal/>}
            {settingsState.addPrintersModal && <AddPrinter/>}
        </>
    )
}