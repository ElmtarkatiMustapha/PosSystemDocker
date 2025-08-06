import { getImageURL } from "../../../../api/api";
import { Lang } from "../../../../assets/js/lang";
import { ActionSelect } from "../../../../components/ActionSelect";

export function Carte({state, handleAction}) {
    return (
        <div className="col-12 customBox col-md-8 col-lg-6 container-fluid p-3">
                    <div className="row m-0">
                        <div className="col-12 col-md-4 pb-2">
                            <div className="picture d-flex justify-content-center pb-2">
                                <div
                                    style={{
                                        backgroundImage:"url("+ getImageURL(state.currentItem?.picture? state.currentItem?.picture :"defaultProfile.jpg" )+")",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        height: "10rem",
                                        width: "10rem",
                                        borderRadius: "100px",
                                        overflow: "hidden"
                                    }}
                                    className="bg-image ">

                                </div>
                            </div>
                            <div style={{
                                borderRadius: "8px",
                                color: "white"
                            }} className="bg-secondary p-1 text-center">
                                <div className="title fw-semibold">{state.currentItem?.name }</div>
                            </div>
                        </div>
                        <div className="col-12 col-md-8 container-fluid ">
                            <div className="row m-0 pb-2">
                                <div className="col-7 p-0">
                                    <h4><Lang>Customer Infos</Lang> </h4>
                                </div>
                                <div className="col-5">
                                    <ActionSelect onChange={handleAction}/>
                                </div>
                            </div>
                            <div className="row m-0">
                                <table>
                                    <tr>
                                        <th>Ice: </th>
                                        <td className="subTitle">{ state.currentItem?.ice}</td>
                                    </tr>
                                    <tr>
                                        <th>Sector: </th>
                                        <td className="subTitle">{state.currentItem?.sector?.title }</td>
                                    </tr>
                                    <tr>
                                        <th>Phone: </th>
                                        <td className="subTitle">{ state.currentItem?.phone}</td>
                                    </tr>
                                    <tr>
                                        <th>State: </th>
                                        <td>
                                            {state.currentItem?.active == 1 ? 
                                            <span style={{ borderRadius: "30px", backgroundColor: "rgba(0, 128, 0, 0.21)", color: "green", fontWeight: "bold" }} className="ps-2 pe-2"><Lang>Active</Lang></span>
                                            :
                                            <span style={{ borderRadius: "30px", backgroundColor: "rgba(128, 0, 0, 0.21)", color: "red", fontWeight: "bold" }} className="ps-2 pe-2"><Lang>Disactive</Lang></span>
                                            }
                                        </td>
                                    </tr>
                                        <tr>
                                            <th>Adresse: </th>
                                            <td className="subTitle"> {state.currentItem?.adresse} </td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
    )
}