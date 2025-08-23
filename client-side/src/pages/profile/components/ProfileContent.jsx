import { useEffect, useState } from "react";
import { useAppAction, useAppState } from "../../../context/context"
import api, { getImageURL } from "../../../api/api";
import { LoadingProfile } from "../../dashboard/components/LoadingProfile";
import { CustomLoader } from "../../../components/CustomLoader";
import { Lang } from "../../../assets/js/lang";
import { LoadingHeader } from "../../../components/LoadingHeader";
import { FilterDate } from "../../../components/FilterDate";
import { DateRangeModal } from "../../../components/DateRangeModal";
import { format } from "date-fns";
import { Sales } from "../../dashboard/users/components/Sales";
import { Purchases } from "../../dashboard/users/components/Purchases";
import { Expenses } from "../../dashboard/users/components/Expenses";
import { DeliveredOrders } from "../../dashboard/users/components/DeliveredOrders";
import { Returns } from "../../dashboard/users/components/Returns";
import { EditModal } from "./EditModal";
import { useProfileAction, useProfileState } from "../../../context/profileContext";
/**
 * this page must finished by managing the daye filter
 */
export function ProfileContent() {
    const appState = useAppState();
    const appAction = useAppAction();
    const profileAction = useProfileAction();
    const profileState = useProfileState();
    const [loading, setLoading] = useState(true);
    const [openCalendar, setOpenCalendar] = useState(false);
    const [selectionRange,setSelectionRange] = useState([{
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
    }])
    const handleFilter = (e) => {
        if (e.target.value === "range") {
            setOpenCalendar(true);
        } else {
            profileAction({
                type: "SET_FILTER",
                payload:e.target.value
            })
        }
    }
        const handleSubmitRange = (e) => {
            e.preventDefault()
            profileAction({
                type: "SET_START_DATE",
                payload: format(selectionRange[0].startDate, "Y-MM-dd")
            })
            profileAction({
                type: "SET_END_DATE",
                payload: format(selectionRange[0].endDate, "Y-MM-dd")
            })
            profileAction({
                type: "SET_FILTER",
                payload: "range"
            })
            handleCloseRangeModal();
        }
        const handleCloseRangeModal = () => {
            setOpenCalendar(false);
        }
    const handleActions = () => {
        profileAction({
            type: "TOGGLE_EDIT_MODAL",
            payload:true
        })
    }

    /**
     * load profile data
     */
    useEffect(() => {
        api({
            method: "post",
            url: "/profile",
            data: {
                filter : profileState.filter,
                startDate : profileState.startDate,
                endDate : profileState.endDate
            },
            // withCredentials:true
        }).then(res => {
            return res.data
        }).then(res => {
            //data 
            profileAction({
                type: "SET_CURRENT_ITEM",
                payload:res.user
            })
            setLoading(false)
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    },[profileState.filter])
    return (
        <>
        <main style={!appState.isMobile &&(appState.userRoles.includes("admin") || appState.userRoles.includes("manager")) ? { marginLeft: "5rem" } : {}} className="p-1"> 
            <div
                style={{
                    marginTop:"4rem"
            }}
            >
            <div className="container-fluid">
                <div className="row">
                    {loading ? 
                    <LoadingProfile/>
                    : 
                    <div className="col-12 col-md-6 col-lg-3 p-2 align-self-center">
                        <div className="picture d-flex justify-content-center pb-2">
                            <div
                                style={{
                                    backgroundImage:"url("+ getImageURL(profileState.currentItem?.picture? profileState.currentItem?.picture :"defaultProfile.jpg" )+")",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    height: "10rem",
                                    width: "10rem"
                                }}
                                className="bg-image rounded-circle position-relative">
                                <div style={{
                                    height: "2.2rem",
                                    width: "2.2rem",
                                    color: "white",
                                    backgroundColor: profileState.currentItem?.rank ==1 ?"#ffd700":profileState.currentItem?.rank == 2? "#C0C0C0" : "#CD7F32" ,
                                    alignContent: "center"
                                    }} className="flag  rounded-circle text-center position-absolute top-0 end-0 fw-bold ">#{profileState.currentItem?.rank}</div>
                            </div>
                        </div>
                        <div style={{
                            borderRadius: "8px",
                            color: "white"
                        }} className="bg-secondary p-1 text-center">
                            <div className="title fw-semibold">{profileState.currentItem?.name}</div>
                        </div>
                    </div>
                    }
                    <div className="col-12 col-md-6 col-lg-5 p-2">
                        <div className="customBox h-100 container-fluid p-4 ">
                            {loading ? 
                                <CustomLoader /> : 
                                <>
                                    <div className="row m-0 pb-2">
                                        <div className="col-7 p-0">
                                            <h4><Lang>User Infos</Lang> </h4>
                                        </div>
                                        <div className="col-5 text-end">
                                                    <button style={{borderRadius:"30px"}} className="btn btn-success" onClick={handleActions}>Edit</button>
                                            {/* <ActionSelect onChange={handleActions}/> */}
                                        </div>
                                    </div>
                                    <div className="row m-0 w-100 table-responsive">
                                        <table className="table">
                                            <tr>
                                                <th><Lang>Cin</Lang>: </th>
                                                <td className="subTitle">{profileState.currentItem?.cin}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Username</Lang>: </th>
                                                <td className="subTitle">{profileState.currentItem?.username}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Email</Lang>: </th>
                                                <td className="subTitle">{profileState.currentItem?.email}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Phone</Lang>: </th>
                                                <td className="subTitle">{profileState.currentItem?.phone}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Printer</Lang>: </th>
                                                <td className="subTitle">{profileState.currentItem?.printer?.name}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Roles</Lang>: </th>
                                                <td className="subTitle">{
                                                    profileState.currentItem?.roles.map(item => {
                                                        return item.title
                                                    })
                                                }</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>State</Lang>: </th>
                                                <td>
                                                    {profileState.currentItem?.active == 1 ? 
                                                    <span style={{ borderRadius: "30px", backgroundColor: "rgba(0, 128, 0, 0.21)", color: "green", fontWeight: "bold" }} className="ps-2 pe-2"><Lang>Active</Lang></span>
                                                    :
                                                    <span style={{ borderRadius: "30px", backgroundColor: "rgba(128, 0, 0, 0.21)", color: "red", fontWeight: "bold" }} className="ps-2 pe-2"><Lang>Disactive</Lang></span>
                                                    }
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </>
                        }
                        </div>
                    </div>
                    <div className="col-12 col-md-12 col-lg-4 ">
                        <div className="p-0 container-fluid ">
                            <div className="row">
                                <div className="col-12 col-md-6 col-lg-12 p-2">
                                    <div className="customBox  container-fluid p-4">
                                        {loading ?
                                            <CustomLoader />
                                            :
                                            <>
                                                <div className="row m-0 pb-2">
                                                    <div className="col-7 p-0">
                                                        <h4><Lang>Sectors</Lang> </h4>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    {
                                                        profileState.currentItem?.sectors.map(item => {
                                                            return (
                                                                <figure key={item.id} className="m-0">
                                                                    <blockquote className="blockquote m-0">
                                                                        <p>{item.title}</p>
                                                                    </blockquote>
                                                                    <figcaption className="blockquote-footer m-0">
                                                                        {item.adresse}
                                                                    </figcaption>
                                                                </figure>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className="col-12 col-md-6 col-lg-12 p-2">
                                    <div className="customBox container-fluid p-4">
                                        {loading ?
                                            <CustomLoader />
                                            :
                                            <>
                                                <div className="row m-0 pb-2">
                                                    <div className="col-7 p-0">
                                                        <h4><Lang>Earning</Lang> </h4>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div style={{ color: "#ffd700" }} className="col-12 h4 m-0 text-center">
                                                        {Number(profileState.currentItem?.earning).toFixed(2)}{appState.settings.businessInfo.currency.symbol}
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid p-0">
                <div className="row m-0 p-2">
                    {loading ? <LoadingHeader /> :
                        <div className="col-12 p-2 headerPage">
                            
                            <div style={{ verticalAlign: "middle" }} className=" align-self-center p-2 d-inline-block">
                                <div className="h3 m-0 title"><Lang>Statistics</Lang> </div>
                            </div>
                            <div style={{ verticalAlign: "middle" }} className="controls h-100 d-inline-block align-content-center float-end ">
                                <FilterDate onChange={handleFilter} filter={profileState.filter} />
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* sales statistics */}
                        {profileState.currentItem?.sales && 
                            <div className="container-fluid p-0">
                                <div className="row m-0">
                                    <Sales state={profileState.currentItem} loading={loading} />
                                </div>
                            </div>
                        }
                        {/* purchase statistics */}
                        {profileState.currentItem?.purchases && 
                            <div className="container-fluid p-0">
                                <div className="row m-0">
                                    <Purchases state={profileState.currentItem}  loading={loading} />
                                </div>
                            </div>
                        }
                        {/* expenses statistics */}
                        {profileState.currentItem?.costs && 
                            <div className="container-fluid p-0">
                                <div className="row m-0">
                                    <Expenses state={profileState.currentItem}  loading={loading} />
                                </div>
                            </div>
                        }
                        {/* delivered statistics */}
                        {profileState.currentItem?.deliveredOrder && 
                            <div className="container-fluid p-0">
                                <div className="row m-0">
                                    <DeliveredOrders state={profileState.currentItem}  loading={loading} />
                                </div>
                            </div>
                        }
                        {/* returns statistics */}
                        {profileState.currentItem?.returns && 
                            <div className="container-fluid p-0">
                                <div className="row m-0">
                                    <Returns state={profileState.currentItem}  loading={loading} />
                                </div>
                            </div>
                        }
            </div>
            </main>
                {profileState.openEditModal && <EditModal />}
                {openCalendar && <DateRangeModal state={selectionRange} handleSubmit={handleSubmitRange} handleClose={handleCloseRangeModal} handleChange={item => setSelectionRange([item.selection])}/>}
            </>
    )
}