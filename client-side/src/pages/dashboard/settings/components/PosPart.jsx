import { Lang } from "../../../../assets/js/lang";
import { ButtonBlue } from "../../../../components/ButtonBlue";
import { CustomLoader } from "../../../../components/CustomLoader";
import { useSettingsAction, useSettingsState } from "../../../../context/settingsContext";

export function PosPart() {
    const settingsActions = useSettingsAction()
    const settingsState = useSettingsState()
    const handleClick = () => {
        settingsActions({
            type: "TOGGLE_POS_MODAL",
            payload: true
        })
    }
    return (
        <div className="customBox h-100 container-fluid p-4">
            {settingsState.loading ?
                <CustomLoader/>
                :
                <>
                    <div className="row m-0 pb-2">
                        <div className="col-7 p-0">
                            <h4><Lang>POS Settings</Lang> </h4>
                        </div>
                        <div className="col-5 text-end">
                            <ButtonBlue label={"Edit"} handleClick={handleClick} type={"button"} />
                        </div>
                        
                    </div>
                    <div className="row m-0 w-100 table-responsive">
                        <table className="table">
                            <tr>
                                <th><Lang>Default TVA</Lang>: </th>
                                <td className="subTitle">{settingsState?.settings?.posSettings?.tva}%</td>
                            </tr>
                            <tr>
                                <th><Lang>Discount</Lang>: </th>
                                <td className="subTitle">
                                    {settingsState?.settings?.posSettings?.discount == 1 ? 
                                    <span style={{ borderRadius: "30px", backgroundColor: "rgba(0, 128, 0, 0.21)", color: "green", fontWeight: "bold" }} className="ps-2 pt-1 pb-1 pe-2"><Lang>Active</Lang></span>
                                    :
                                    <span style={{ borderRadius: "30px", backgroundColor: "rgba(128, 0, 0, 0.21)", color: "red", fontWeight: "bold" }} className="ps-2 pt-1 pb-1 pe-2"><Lang>Disactive</Lang></span>
                                    }
                                </td>
                            </tr>
                        </table>
                    </div>
                </>
            }
        </div>
    )
}