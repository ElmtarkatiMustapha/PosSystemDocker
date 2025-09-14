import api from "../../../../api/api";
import { Lang } from "../../../../assets/js/lang";
import { ButtonBlue } from "../../../../components/ButtonBlue";
import { CustomLoader } from "../../../../components/CustomLoader";
import { SelectAction } from "../../../../components/SelectAction";
import { useAppAction, useAppState } from "../../../../context/context";
import { useSettingsAction, useSettingsState } from "../../../../context/settingsContext";
import { EditPrinterModal } from "./modals/EditPrinterModal";
import { ViewPrinterModal } from "./modals/ViewPrinterModal";

export function PrintersPart() {
    const appState = useAppState()
    const appAction = useAppAction()
    const settingsAction = useSettingsAction()
    const settingsState = useSettingsState()
    const handleClick = () => {
        settingsAction({
            type: "TOGGLE_ADD_PRINTER_MODAL",
            payload: true
        })
    }
    /**
     * 
     * @param {Event} e
     * @todo get id of the current printer 
     * @todo handle the action that will execute 
     */
    const handleChangeAction = (e) => {
        const id = e.target.getAttribute("data-id");
        switch (e.target.value) {
            case "view":
                //open view modal
                settingsAction({
                    type: "SET_VIEWED_PRINTER",
                    payload:id,
                })
                settingsAction({
                    type: "TOGGLE_VIEW_PRINTER_MODAL",
                    payload:true,
                })
                e.target.value = "default"
                break;
            case "edit":
                //open edit modal
                settingsAction({
                    type: "TOGGLE_EDIT_PRINTER_MODAL",
                    payload:true,
                })
                settingsAction({
                    type: "SET_EDITED_PRINTER",
                    payload:id,
                })
                e.target.value = "default"
                break;
            case "remove":
                //remove this printer 
                if (confirm("Are you sure with this action")) {
                    settingsAction({
                        type: "SET_LOADING",
                        payload: true
                    })
                    api({
                        method: "delete",
                        url: "/settings/printer/" + id,
                        // withCredentials:true
                    }).then(res => {
                        return res.data
                    }).then(res => {
                        //handle data returned
                        settingsAction({
                            type: "UPDATE_SETTINGS",
                            payload: res.data
                        })
                        appAction({
                            type: "SET_SUCCESS",
                            payload: res?.message
                        })
                        settingsAction({
                            type: "SET_LOADING",
                            payload: false
                        })
                        e.target.value = "default"
                    }).catch(err => {
                        //handle error
                        settingsAction({
                            type: "SET_LOADING",
                            payload: false
                        })
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.message
                        })
                        e.target.value = "default"
                    })
                }
                break;
            default:
                //nothing
                e.target.value = "default";
                break;
        }
    }
    return (
        <>
        <div className="customBox h-100 container-fluid p-4">
            {settingsState.loading ? 
                <CustomLoader />
                :
                <>
                    <div className="row m-0 pb-2">
                        <div className="col-7 p-0">
                            <h4><Lang>Printers</Lang> </h4>
                        </div>
                        <div className="col-5 text-end">
                            <ButtonBlue label={"Add"} handleClick={handleClick} type={"button"} />
                        </div>
                    </div>
                    {settingsState?.settings?.printers?.map((item) => {
                        return (
                            <div key={item.id} className="row m-0 w-100 table-responsive">
                                <div className="col-4">
                                    <div className="text-truncate"><Lang>Printer name</Lang></div>
                                    <div className="fs-6  text-secondary">{item.name}</div>
                                </div>
                                <div className="col-4">
                                    <div className="text-truncate"><Lang>Description</Lang></div>
                                    <div className="fs-6  text-secondary">{item.description}</div>
                                </div>
                                <div className="col-4">
                                    <SelectAction id={item.id} options={appState.selectData} onChange={handleChangeAction} />
                                </div>
                            </div>
                        )
                    })}
                </>
            }
            </div>
            {/* modals */}
            {settingsState.viewPrinterModal && 
            <ViewPrinterModal/>
            }
            {settingsState.editPrinterModal && 
            <EditPrinterModal/>
            }
        </>
    )
}