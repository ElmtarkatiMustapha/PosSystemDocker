import { useEffect, useRef, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { Spinner } from "../../../../components/Spinner";
import { useAppAction } from "../../../../context/context";
import { PrimaryButton } from "../../../../components/primaryButton";
import api from "../../../../api/api";
import { useUsersAction, useUsersState } from "../../../../context/usersContext";
import { UploadImage } from "../../../../components/UploadImage";
import { FaXmark } from "react-icons/fa6";

export function AddNewModal() {
    const [loading, setLoading] = useState(true);
    const appAction = useAppAction();
    const usersAction = useUsersAction();
    const refPassword = useRef();
    const refPassMsg = useRef(null);
    const refCashier = useRef();
    const [roles, setRoles] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [printers, setPrinters] = useState([]);
    const [sectorsSelected, setSectorsSelected] = useState([]);

    useEffect(() => {
        //get sectors
        (async () => {
            //get data
            try {
                const resSectors = await loadSectors();
                const resRoles = await loadRoles();
                const resPrinters = await loadPrinters();
                //set data
                setSectors(resSectors.data.data);
                setSectorsSelected([]);
                setRoles(resRoles.data.data);
                setPrinters(resPrinters.data.data);
                setLoading(false);
            } catch (err) {
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                });
                setLoading(false);
                handleClose();
            }
        })();
    },[])
    
    const handleClose = () => {
        usersAction({
            type: "TOGGLE_ADD_MODAL",
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
        formData.append("cashier",refCashier.current.checked?1:0)
        setLoading(true);
        api({
            method: "POST",
            url: "/addUser",
            data: {
                name: formData.get("name"),
                email: formData.get("email"),
                username: formData.get("username"),
                cin: formData.get("cin"),
                phone: formData.get("phone"),
                password: formData.get("password"),
                picture: formData.get("picture"),
                printer_id: formData.get("printer_id"),
                roles: formData.getAll("roles"),
                cashier: formData.get("cashier"),
                sectors: sectorsSelected.map(item=>item.id)
            },
            //withCredentials: true,
            headers:{
                "accept": "application/json",
                "Content-Type":"multipart/form-data"
            }
        }).then(res => {
            return res.data;
        }).then(res => {
            usersAction({
                type: "ADD_ITEM",
                payload: res.data
            })
            appAction({
                type: "SET_SUCCESS",
                payload: "Add with success"
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
        console.log("start add")
        let value = e.target.value;
        let array = sectors.filter(elem => {
            if (elem.id == value) {
                setSectorsSelected(sectorsSelected?.concat([{ id: elem.id, title: elem.title }]))
                return false;
            } else {
                return true
            }
        })
        setSectors(array);
        e.target.value = 0;
        console.log("end add")
    }
    const removeSector = (id) => {
        console.log("start remove "+id)
        let array = sectorsSelected.filter(elem => {
            if (id == elem.id) {
                setSectors(sectors?.concat([{ id: elem.id, title: elem.title }]))
                return false
            } else {
                return true;
            }
        })
        setSectorsSelected(array);
        console.log("end remove")

    }
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" >
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form onSubmit={handleSubmit} className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Add User</Lang> :</div>
                            <div className="sub-title"><Lang>Fill in the fields</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>CIN</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="cin"  className="form-control" placeholder={Lang({ children: "Tap CIN" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Name</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="name"  className="form-control" placeholder={Lang({ children: "Tap Name" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Username</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="username"  className="form-control" placeholder={Lang({ children: "Tap UserName" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Email</Lang>* : {loading && <Spinner/>}</label>
                            <input type="text" required disabled={loading} name="email"  className="form-control" placeholder={Lang({ children: "Tap Email" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Phone</Lang> : {loading && <Spinner/>}</label>
                            <input type="text"  disabled={loading} name="phone"  className="form-control" placeholder={Lang({ children: "Tap phone" })}   />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Password (min 4 character)</Lang>* : {loading && <Spinner/>}</label>
                            <input type="password" ref={refPassword} required minLength={4}  disabled={loading} name="password"  className="form-control" placeholder={Lang({ children: "Tap Password" })}   />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Password Confirm</Lang>* : {loading && <Spinner/>}</label>
                            <input type="password"  required onChange={confirmPass} minLength={4} disabled={loading} name="passwordConf" className="form-control" placeholder={Lang({ children: "retap Password" })} />
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
                                            <input className="form-check-input" type="checkbox" name="roles" id={"inlineCheckbox"+item.id} value={item.id} />
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
                                    return <option key={item.id}  value={item.id}>{item.name}</option>
                                })}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Picture</Lang> : {loading && <Spinner/>}</label>
                            <UploadImage loading={loading} image="" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Cashier</Lang> : {loading && <Spinner/>}</label>
                            <div className="state">
                                <div className="form-check form-switch">
                                    <input  className="form-check-input" ref={refCashier} type="checkbox" role="switch" id="flexSwitchCheckChecked" defaultChecked={true} />
                                    <label className="form-check-label" htmlFor="flexSwitchCheckChecked"><Lang>Enable</Lang></label>
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
            //withCredentials: true,
        })
    }
const loadSectors = () => {
    return api({
        method: "get",
        url: "/allSectors",
        //withCredentials: true,
    })
}
const loadPrinters = () => {
    return api({
        method: "GET",
        url: "/settings/printers",
        //withCredentials: true,
    })
}