import { Lang } from "../../../../assets/js/lang";
import { ActionSelect } from "../../../../components/ActionSelect";

export function Carte({state, handleAction}) {
    return (
        <div className="col-12 customBox col-md-8 col-lg-6 container-fluid p-3">
                    <div className="row m-0">
                        <div className="col-12 container-fluid ">
                            <div className="row m-0 pb-2">
                                <div className="col-7 p-0">
                                    <h4><Lang>Cash register session</Lang> </h4>
                                </div>
                                <div className="col-5">
                                    <ActionSelect onChange={handleAction}/>
                                </div>
                            </div>
                            <div className="row m-0">
                                <table>
                                    <tr>
                                        <th><Lang>User</Lang>: </th>
                                        <td className="subTitle">{ state.currentItem?.session?.user?.name}</td>
                                    </tr>
                                    <tr>
                                        <th><Lang>Opened at</Lang>: </th>
                                        <td className="subTitle">{ state.currentItem?.session?.opened_at}</td>
                                    </tr>
                                    <tr>
                                        <th><Lang>Closed at</Lang>: </th>
                                        <td className="subTitle">{state.currentItem?.session?.closed_at }</td>
                                    </tr>
                                    <tr>
                                        <th><Lang>Opening amount</Lang>: </th>
                                        <td className="subTitle">{Number( state.currentItem?.session?.opening_amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th><Lang>Closing amount</Lang>: </th>
                                        <td className="subTitle">{ Number(state.currentItem?.session?.closing_amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <th><Lang>Note</Lang>: </th>
                                        <td className="subTitle">{state.currentItem?.session?.note}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
    )
}