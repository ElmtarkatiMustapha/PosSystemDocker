import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { Spinner } from "../../../../components/Spinner";
import { useAppAction, useAppState } from "../../../../context/context";
import { PrimaryButton } from "../../../../components/primaryButton";
import api, { getImageURL } from "../../../../api/api";
import { UploadImage } from "../../../../components/UploadImage";
import { useUsersAction, useUsersState } from "../../../../context/usersContext";
import { FaXmark } from "react-icons/fa6";

export function EditModal() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState();
    const appAction = useAppAction();
    const usersState = useUsersState();
    const usersAction = useUsersAction();
    const refPassword = useRef();
    const refPassMsg = useRef(null);
    const refActive = useRef();
    const refCashier = useRef();
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState();
    const [sectors, setSectors] = useState([]);
    const [sectorsSelected, setSectorsSelected] = useState([]);
    const [printers, setPrinters] = useState([]);
    const appState = useAppState();
    useEffect(()=> {
        //get supplier infos
        (async ()=>{
            try {
                //get data
                /**
                 * fetch all data from the server
                 */
                //get sector
                const resSectors = await loadSectors()
                //get user infos
                const resUserManage = await loadUser(usersState.editItem)
                //get Roles
                const resRoles = await loadRoles();
                //get printers
                const resPrinters = await loadPrinters();
                // set data
                setSectors(resSectors.data.data);
                setUser(resUserManage.data.data);
                setRoles(resRoles.data.data);
                setPrinters(resPrinters.data.data);
                //set user Roles
                setSelectedRoles(resUserManage.data.data?.roles?.map(item => item.id))
                //set User Sectors
                setSectorsSelected(resUserManage.data.data?.sectors);
                setLoading(false)
            } catch (err) {
                //hndle error
                setLoading(false);
                handleClose();
            }

        })();
    }, [])
    useEffect(() => {
        let array = sectors.filter((item) => {
            let check= true;
            sectorsSelected.forEach((elem) => {
                if (elem.id == item.id) {
                    check = false;
                }
            })
            return check;
        })
        setSectors(array);
    }, [sectorsSelected])

    const handleClose = () => {
        usersAction({
            type: "TOGGLE_EDIT_MODAL",
            payload: false,
        })
    }
    //handle submit 
    
    const handleSubmit = (e) => {
        e.preventDefault();
        let formData = new FormData(e.target);
        //check the passwords are equal
        if (formData.get("password") !== formData.get("passwordConf")) {
            appAction({
                type: "SET_ERROR",
                payload: "Passwords not equal"
            })
            return true;
        }
        //check if roles selected
        if (formData.getAll("roles").length <= 0) {
            appAction({
                type: "SET_ERROR",
                payload: "select one or more role"
            })
            return true;
        }
        //check if sector chosed
        if (sectorsSelected.length <= 0) {
            appAction({
                type: "SET_ERROR",
                payload: "select one or more sector"
            })
            return true;
        }
        //set state
        formData.append("active",refActive.current.checked?1:0)
        //set cashier mode
        formData.append("cashier", refCashier.current.checked ? 1 : 0)
        console.log(formData.get("cashier"))
        setLoading(true);
        api({
            method: "POST",
            url: "/user/" + user.id,
            data: {
                name: formData.get("name"),
                email: formData.get("email"),
                username: formData.get("username"),
                cin: formData.get("cin"),
                phone: formData.get("phone"),
                password: formData.get("password"),
                picture: formData.get("picture"),
                active: formData.get("active"),
                cashier: formData.get("cashier"),
                printer_id: formData.get("printer_id"),
                roles: formData.getAll("roles"),
                sectors: sectorsSelected.map(item=>item.id)
            },
            withCredentials: true,
            headers:{
                "accept": "application/json",
                "Content-Type":"multipart/form-data"
            }
        }).then(res => {
            return res.data;
        }).then(res => {
            usersAction({
                type: "UPDATE_CURRENT_ITEM",
                payload: res.data
            })
            usersAction({
                type: "UPDATE_ITEM",
                payload: res.data
            })
            //check if this user is the current user
            if(appState.currentUser?.id === res.data?.id){
                appAction({
                    type: "UPDATE_CURRENT_USER",
                    payload: res.data
                })
            }
            appAction({
                type: "SET_SUCCESS",
                payload: "Updated with success"
            })
            handleClose();
            setLoading(false);
        }).catch(err => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false);
        })
    }
    const confirmPass = (e) => {
        let value = e.target.value
        let password = refPassword.current.value
        if (value !== "" && value === password) {
            refPassMsg.current.innerText = "Valid!!"
            refPassMsg.current.style = "color: green"
        } else {
            refPassMsg.current.innerText = "Invalid!!"
            refPassMsg.current.style = "color: red"
            
        }
    }
    const addSector = (e) => {
        let value = e.target.value;
         sectors.filter(elem => {
            if (elem.id == value) {
                setSectorsSelected(sectorsSelected?.concat([{ id: elem.id, title: elem.title }]))
                return false;
            } else {
                return true
            }
        })
        e.target.value = 0;
    }
    const removeSector = (id) => {
        let array = sectorsSelected.filter(elem => {
            if (id == elem.id) {
                setSectors(sectors?.concat([{ id: elem.id, title: elem.title }]))
                return false
            } else {
                return true;
            }
        })
        setSectorsSelected(array);

    }
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Edit User</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>CIN</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="cin"  className="form-control" defaultValue={user?.cin} placeholder={Lang({ children: "Tap CIN" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="name"  className="form-control" defaultValue={user?.name} placeholder={Lang({ children: "Tap Name" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Username</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="username"  className="form-control" defaultValue={user?.username} placeholder={Lang({ children: "Tap UserName" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Email</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="email"  className="form-control" defaultValue={user?.email} placeholder={Lang({ children: "Tap Email" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="phone"  className="form-control" defaultValue={user?.phone} placeholder={Lang({ children: "Tap phone" })}   />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Reset Password (min 4 character)</Lang> : {loading && <Spinner/>}</label>
                            <input type="password" ref={refPassword}  minLength={4}  disabled={loading} name="password"  className="form-control" placeholder={Lang({ children: "Tap Password" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Password Confirm</Lang> : {loading && <Spinner/>}</label>
                            <input type="password"   onChange={confirmPass} minLength={4} disabled={loading} name="passwordConf" className="form-control" placeholder={Lang({ children: "retap Password" })} />
                            <p><em ref={refPassMsg}><Lang>Passwords must be the same</Lang></em></p>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Sectors</Lang> : {loading && <Spinner />}</label>
                            {/* load selected sectors */}
                            <div className="p-2">
                                {sectorsSelected?.map((item) => {
                                    return (
                                        <div key={item.id} className="p-1 d-inline-block">
                                            <div  className="  p-1 rounded-pill bg-body-secondary">
                                                <div className="d-inline-block pe-1 ps-1 fw-medium ">{ item.title}</div><FaXmark onClick={(e)=>removeSector(item.id)} role="button" data-id={item.id} className="fw-bold text-danger  fs-4"/>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            {/* load all sectors */}
                            <select  name="sector_id" onChange={addSector} className="form-select"  id="">
                                <option value={0}><Lang>Add Sector</Lang></option>
                                {sectors?.map((item) => {
                                return <option key={item.id} value={item.id}>{ item.title}</option>
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="from-label h5"><Lang>Roles</Lang> : {loading && <Spinner />}</label>
                            <div>
                                {/* load all Roles */}
                                {roles?.map(item => {
                                    return (
                                        <div key={item.id} className="form-check form-check-inline">
                                            {usersState.editItem == appState.currentUser.id ? 
                                                <input className="form-check-input"  type="checkbox" checked={selectedRoles.includes(item.id)} name="roles" id={"inlineCheckbox"+item.id} value={item.id} />
                                                :
                                                <input className="form-check-input"  type="checkbox" defaultChecked={selectedRoles.includes(item.id)} name="roles" id={"inlineCheckbox"+item.id} value={item.id} />
                                            } 
                                            <label className="form-check-label" htmlFor={"inlineCheckbox"+item.id} >{item.title}</label>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Printer</Lang> : {loading && <Spinner />}</label>
                            <select  name="printer_id"  className="form-select"  >
                                <option value={0}><Lang>Chose printer</Lang></option>
                                {printers?.map((item) => {
                                    if (item.id == user?.printer_id) {
                                        return <option key={item.id} selected value={item.id}>{item.name}</option>
                                    } else {
                                        return <option key={item.id}  value={item.id}>{item.name}</option>
                                    }
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner/>}</label>
                            <UploadImage loading={loading} image={getImageURL(user?.picture)} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>State</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    {usersState.editItem == appState.currentUser.id ? 
                                        <input  className="form-check-input" ref={refActive} type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={user?.active} />
                                        :
                                        <input  className="form-check-input" ref={refActive} type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={user?.active} />
                                    } 
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked"><Lang>Enable</Lang></label>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Cashier</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input  className="form-check-input" ref={refCashier} type="checkbox" role="switch" id="flexSwitchCheckChecked2" defaultChecked={user?.cashier} />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked2"><Lang>Enable</Lang></label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <PrimaryButton label={"Save"} handleClick={()=>null} disabled={loading} type={"submit"} />
                    </div>
                </form>
            </div>
        </div>
    )
}

const loadRoles =  () => {
        return api({
            method: "get",
            url: "/allRoles",
            withCredentials: true,
        })
    }
const loadSectors = () => {
    return api({
        method: "get",
        url: "/allSectors",
        withCredentials: true,
    })
}
const loadUser = (id) => {
    return api({
        method: "GET",
        url: "/userManage/" + id,
        withCredentials: true,
    })
}
const loadPrinters = () => {
    return api({
        method: "GET",
        url: "/settings/printers",
        withCredentials: true,
    })
}