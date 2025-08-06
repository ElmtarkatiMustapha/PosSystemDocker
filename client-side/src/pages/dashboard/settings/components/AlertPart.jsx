import { Lang } from "../../../../assets/js/lang";
import { ButtonBlue } from "../../../../components/ButtonBlue";
import { CustomLoader } from "../../../../components/CustomLoader";
import { useSettingsAction, useSettingsState } from "../../../../context/settingsContext";

export function AlertPart() {
    const settingsActions = useSettingsAction()
    const settingsState = useSettingsState()
    const handleClick = () => {
        settingsActions({
            type: "TOGGLE_ALERT_MODAL",
            payload: true
        })
    }
    return (
        <div className="customBox h-100 container-fluid p-4">
            {settingsState.loading ?
                <CustomLoader />
                :
                <>
                    <div className="row m-0 pb-2">
                        <div className="col-7 p-0">
                            <h4><Lang>Alert Settings</Lang> </h4>
                        </div>
                        <div className="col-5 text-end">
                            <ButtonBlue label={"Edit"} handleClick={handleClick} type={"button"} />
                            {/* <ActionSelect onChange={handleActions}/> */}
                        </div>
                
                    </div>
                    <div className="row m-0 w-100 table-responsive">
                        <table className="table">
                            <tr>
                                <th><Lang>Stock alert</Lang>: </th>
                                <td className="subTitle">{settingsState?.settings?.alertSettings?.stock_alert} <Lang>Pieces</Lang></td>
                            </tr>
                            <tr>
                                <th><Lang>Stock Expiration</Lang>: </th>
                                <td className="subTitle">{settingsState?.settings?.alertSettings?.stock_expiration} <Lang>days</Lang></td>
                            </tr>
                            <tr>
                                <th><Lang>Rapport email</Lang>: </th>
                                <td className="subTitle">
                                    {settingsState?.settings?.alertSettings?.repport_email?.map((item,index) => {
                                        return (
                                            <div className="p-0" key={index}>
                                                {item}
                                            </div>
                                        )
                                            
                                    })}
                                </td>
                            </tr>
                            <tr>
                                <th><Lang>Host</Lang>: </th>
                                <td className="subTitle">{settingsState?.settings?.alertSettings?.host}</td>
                            </tr>
                            <tr>
                                <th><Lang>Port</Lang>: </th>
                                <td className="subTitle">{settingsState?.settings?.alertSettings?.port}</td>
                            </tr>
                            <tr>
                                <th><Lang>UserName</Lang>: </th>
                                <td className="subTitle">{settingsState?.settings?.alertSettings?.username}</td>
                            </tr>
                            <tr>
                                <th><Lang>Password</Lang>: </th>
                                <td className="subTitle">***********</td>
                            </tr>
                        </table>
                    </div>
                </>
            }
        </div>
    )
}