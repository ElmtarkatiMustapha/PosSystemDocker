import { useNavigate, useParams } from "react-router-dom"
import { LoadingProfile } from "../../components/LoadingProfile";
import api, { getImageURL } from "../../../../api/api";
import { ActionSelect } from "../../../../components/ActionSelect";
import { Lang } from "../../../../assets/js/lang";
import { useUsersAction, useUsersState } from "../../../../context/usersContext";
import { useEffect, useState } from "react";
import { DateFilter } from "../../../../components/DateFilter";
import { LoadingHeader } from "../../customers/components/LoadingHeader";
import { CustomLoader } from "../../../../components/CustomLoader";
import { SelectAction } from "../../../../components/SelectAction";
import { useAppAction, useAppState } from "../../../../context/context";
import { Sales } from "../components/Sales";
import { Purchases } from "../components/Purchases";
import { Expenses } from "../components/Expenses";
import { DeliveredOrders } from "../components/DeliveredOrders";
import { Returns } from "../components/Returns";
import { EditModal } from "../components/EditModal";

export function SingleUser() {
    const { id } = useParams();
    const usersState = useUsersState();
    const usersAction = useUsersAction();
    const [loading, setLoading] = useState(true);
    const appState = useAppState();
    const appAction = useAppAction();
    const navigate = useNavigate();
    const columns = [
        {
            name: Lang({ children: "Id" }),
            selector: row => row.id,
            sortable: true
        },
        {
            name: Lang({ children: "User" }),
            selector: row => row.user,
            sortable: true
        },
        {
            name: Lang({ children: "QNT" }),
            selector: row => row.qnt,
            sortable: true
        },
        {
            name: Lang({ children: "Total TTC" }),
            selector: row => Number(Number(row.turnover).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Date" }),
            selector: row => row.date,
            sortable: true
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <SelectAction options={appState.selectData} id={row.id} onChange={handleActions} />,
            sortable: false
        },
    ]
    useEffect(() => {
        setLoading(true)
        api({
            method: "post",
            url: "/singleUser/"+id,
            data: {
                filter: usersState.filter,
                startDate: usersState.startDate,
                endDate: usersState.endDate
            },
            withCredentials: true
        }).then((res) => {
            return res.data;
        }).then((res) => {
            //data here in res.data
            usersAction({
                type: "SET_CURRENT_ITEM",
                payload: res.data
            })
            setLoading(false);
        }).catch((err) => {
            // handle error
            appAction({
                type: "SET_ERROR",
                payload: "something wrong"
            })
            setLoading(false);
        })
    }, [usersState.filter])
    /**
     * handle edit and remove the current 
     */
    const handleActions = (e) => {
        switch (e.target.value) {
            case "remove":
                if (window.confirm("are you sure you want to delete this user")) {
                    setLoading(true)
                    // handle remove
                    api({
                        method: "delete",
                        url: "/user/" + id,
                        withCredentials: true
                    }).then(res => {
                        //handle response success
                        appAction({
                            type: "SET_SUCCESS",
                            payload: "success"
                        });
                        usersAction({
                            type: "REMOVE_ONE",
                            payload: id
                        })
                        
                        setLoading(false)
                        navigate("/users")
                    }).catch(err => {
                        //handle error
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        })
                        setLoading(false)
                        e.target.value = "default"
                    })
                } else {
                    e.target.value = "default"
                }
                break;
            case "edit":
                usersAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload: true,
                })
                usersAction({
                    type: "SET_EDIT_ITEM",
                    payload: id
                })
                e.target.value = "default"
                break;
            default:
                break;
        }
    }
    const payEarning = () => {
        //payed margin
        setLoading(true);
        api({
            method: "post",
            url: "payEarning/" + id,
            withCredentials: true
        }).then(res => {
            usersAction({
                type: "SET_EARNING",
                payload: 0
            })
            setLoading(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: "something wrong"
            })
            setLoading(false);
        })
    }
    return (
        <div className="single-page">
            <div className="container-fluid">
                <div className="row">
                    {loading ? 
                    <LoadingProfile/>
                    : 
                    <div className="col-12 col-md-6 col-lg-3 p-2 align-self-center">
                        <div className="picture d-flex justify-content-center pb-2">
                            <div
                                style={{
                                    backgroundImage:"url("+ getImageURL(usersState.currentItem?.picture? usersState.currentItem?.picture :"defaultProfile.jpg" )+")",
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
                                    backgroundColor: usersState.currentItem?.rank ==1 ?"#ffd700":usersState.currentItem?.rank == 2? "#C0C0C0" : "#CD7F32" ,
                                    alignContent: "center"
                                    }} className="flag  rounded-circle text-center position-absolute top-0 end-0 fw-bold ">#{usersState.currentItem?.rank}</div>
                            </div>
                        </div>
                        <div style={{
                            borderRadius: "8px",
                            color: "white"
                        }} className="bg-secondary p-1 text-center">
                            <div className="title fw-semibold">{usersState.currentItem?.name}</div>
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
                                            <ActionSelect onChange={handleActions}/>
                                        </div>
                                    </div>
                                    <div className="row m-0 w-100 table-responsive">
                                        <table className="table">
                                            <tr>
                                                <th><Lang>Cin</Lang>: </th>
                                                <td className="subTitle">{usersState.currentItem?.cin}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Username</Lang>: </th>
                                                <td className="subTitle">{usersState.currentItem?.username}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Email</Lang>: </th>
                                                <td className="subTitle">{usersState.currentItem?.email}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Phone</Lang>: </th>
                                                <td className="subTitle">{usersState.currentItem?.phone}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Printer</Lang>: </th>
                                                <td className="subTitle">{usersState.currentItem?.printer?.name}</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Roles</Lang>: </th>
                                                <td className="subTitle">{
                                                    usersState.currentItem?.roles.map(item => {
                                                        return item.title
                                                    })
                                                }</td>
                                            </tr>
                                            <tr>
                                                <th><Lang>State</Lang>: </th>
                                                <td>
                                                    {usersState.currentItem?.active == 1 ? 
                                                    <span style={{ borderRadius: "30px", backgroundColor: "rgba(0, 128, 0, 0.21)", color: "green", fontWeight: "bold" }} className="ps-2 pt-1 pb-1 pe-2"><Lang>Active</Lang></span>
                                                    :
                                                    <span style={{ borderRadius: "30px", backgroundColor: "rgba(128, 0, 0, 0.21)", color: "red", fontWeight: "bold" }} className="ps-2 pt-1 pb-1 pe-2"><Lang>Disactive</Lang></span>
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <th><Lang>Cashier Mode</Lang>: </th>
                                                <td>
                                                    {usersState.currentItem?.cashier == 1 ? 
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
                                                        usersState.currentItem?.sectors.map(item => {
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
                                                    <div className="col-5 p-0 text-end">
                                                        <button onClick={payEarning} className="btn rounded-pill btn-primary pt-1 pb-1 fw-bold">Payed</button>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div style={{ color: "#ffd700" }} className="col-12 h4 m-0 text-center">
                                                        {Number(usersState.currentItem?.earning).toFixed(2)}dh
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
                                <DateFilter state={usersState} dispatch={usersAction} />
                            </div>
                        </div>
                    }
                </div>
            </div>
            {/* sales statistics */}
            {usersState.currentItem?.sales && 
                <div className="container-fluid p-0">
                    <div className="row m-0">
                        <Sales state={usersState.currentItem} action={usersAction} loading={loading} />
                    </div>
                </div>
            }
            {/* purchase statistics */}
            {usersState.currentItem?.purchases && 
                <div className="container-fluid p-0">
                    <div className="row m-0">
                        <Purchases state={usersState.currentItem} action={usersAction} loading={loading} />
                    </div>
                </div>
            }
            {/* expenses statistics */}
            {usersState.currentItem?.costs && 
                <div className="container-fluid p-0">
                    <div className="row m-0">
                        <Expenses state={usersState.currentItem} action={usersAction} loading={loading} />
                    </div>
                </div>
            }
            {/* delivered statistics */}
            {usersState.currentItem?.deliveredOrder && 
                <div className="container-fluid p-0">
                    <div className="row m-0">
                        <DeliveredOrders state={usersState.currentItem} action={usersAction} loading={loading} />
                    </div>
                </div>
            }
            {/* returns statistics */}
            {usersState.currentItem?.returns && 
                <div className="container-fluid p-0">
                    <div className="row m-0">
                        <Returns state={usersState.currentItem} action={usersAction} loading={loading} />
                    </div>
                </div>
            }
            { usersState.openEditModal && <EditModal/>}
        </div>
    )
}