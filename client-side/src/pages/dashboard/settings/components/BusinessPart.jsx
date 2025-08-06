import { Lang } from "../../../../assets/js/lang";
import { ButtonBlue } from "../../../../components/ButtonBlue";
import { CustomLoader } from "../../../../components/CustomLoader";
import { useSettingsAction, useSettingsState } from "../../../../context/settingsContext";

export function BusinessPart() {
    const settingsActions = useSettingsAction()
    const settingsState = useSettingsState();
    const handleClick = () => {
        settingsActions({
            type: "TOGGLE_BUSINESS_MODAL",
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
                        <h4><Lang>Business Infos</Lang> </h4>
                    </div>
                    <div className="col-5 text-end">
                        <ButtonBlue label={"Edit"} handleClick={handleClick} type={"button"} />
                        {/* <ActionSelect onChange={handleActions}/> */}
                    </div>
                    
                </div>
                <div className="row m-0 w-100 table-responsive">
                    <table className="table">
                        <tr>
                            <th><Lang>Name</Lang>: </th>
                            <td className="subTitle">{settingsState?.settings?.businessInfo?.name}</td>
                        </tr>
                        <tr>
                            <th><Lang>Adresse</Lang>: </th>
                            <td className="subTitle">{settingsState?.settings?.businessInfo?.adresse}</td>
                        </tr>
                        <tr>
                            <th><Lang>Phone</Lang>: </th>
                            <td className="subTitle">{settingsState?.settings?.businessInfo?.phone}</td>
                        </tr>
                        <tr>
                            <th><Lang>Email</Lang>: </th>
                            <td className="subTitle">{settingsState?.settings?.businessInfo?.email}</td>
                        </tr>
                        <tr>
                            <th><Lang>ICE</Lang>: </th>
                            <td className="subTitle">{settingsState?.settings?.businessInfo?.ice}</td>
                        </tr>
                        <tr>
                            <th><Lang>Currency</Lang> </th>
                            <td className="subTitle">{settingsState?.settings?.businessInfo?.currency?.name}</td>
                        </tr>
                    </table>
                </div>
            </>
            }
        </div>
    )
}