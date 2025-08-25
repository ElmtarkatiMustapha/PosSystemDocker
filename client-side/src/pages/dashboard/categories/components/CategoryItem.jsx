
import { SelectAction } from "../../../../components/SelectAction";
import api, { getImageURL } from "../../../../api/api";
import { useNavigate } from "react-router-dom";
import { useAppAction, useAppState } from "../../../../context/context";
import { useCateAction, useCateState } from "../../../../context/categoriesContext";
export function CategoryItem({ data }) {
    const navigate = useNavigate();
    const appAction = useAppAction();
    const cateAction = useCateAction();
    const cateState = useCateState();
    const appState = useAppState();
    const selectData = [
        {
            name: "View",
            value: "view"
        },
        {
            name: "Remove",
            value: "remove"
        },
        {
            name: "Edit",
            value: "edit"
        }
    ]
    const handleAction = (e) => {
        const action = e.target.value;
        switch (action) {
            case "remove":
                //code break
                if (window.confirm("are you sure you want to delete this category" )) {
                    cateAction({
                        type: "SET_LOADING",
                        payload: true
                    })
                    api({
                        method: "DELETE",
                        url: "/category/"+data.id,
                        // withCredentials:true,
                    }).then(res => {
                        return res.data;
                    }).then(res => {
                        //reload the list 
                        cateAction({
                            type: "LOAD_CATEGORIES",
                            payload:{
                                ...cateState,
                                allItems: res.data,
                                storedItems:res.data,
                                numberPages: Math.ceil(res.data.length / cateState.itemsPerPage),
                                currentList: res.data.slice(
                                    (cateState.currentPage - 1) * cateState.itemsPerPage,
                                    cateState.currentPage * cateState.itemsPerPage
                                )
                            }
                        });
                        cateAction({
                            type: "SET_LOADING",
                            payload: false
                        })
                        appAction({
                            type: "SET_SUCCESS",
                            payload: res.message
                        })
                        
                    }).catch(err => {
                        cateAction({
                            type: "SET_LOADING",
                            payload: false
                        })
                        appAction({
                            type: "SET_ERROR",
                            payload: err?.response?.data?.message
                        })
                    })
                } else {
                    e.target.value = "default"
                }
                break;
            case "view":
                navigate("/categories/" + data.id);
                break;
            case "edit":
                cateAction({
                    type: "SET_EDIT_CATEGORY",
                    payload:data.id
                })
                cateAction({
                    type: "TOGGLE_EDIT_MODAL",
                    payload:true
                })
                e.target.value = "default"
                break;
            default:
            //code
                e.target.value = "default"
        }
    }
    
    return (
        <div className="col-12 col-lg-6 pt-3 pb-3 ps-1 pe-1 container-fluid">
            <div className="item pt-2 pb-2 ps-2 pe-2 row m-0">
                <div  className="image align-self-center col-3 col-md-2 pt-2 pb-2 d-inline-block">
                    <div
                        style={{
                            backgroundImage:"url("+ getImageURL(data.picture)+")",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                            height: "3.5rem",
                            width: "3.5rem",
                            borderRadius: "50px",
                            overflow: "hidden"
                        }}
                        className="bg-image">

                    </div>
                </div>
                <div className="infos col-8  col-md-3 pt-2 pb-2 align-self-center d-inline-block">
                    
                    <div  className={data.active === 0 ? "title text-danger":"title"}>{data.name}</div>
                    <div className="subTitle">Products: { data.nbProducts}</div>
                </div>
                <div  className="statistic align-self-center pt-2 pb-2 text-start text-md-center  col-7 col-md-4 d-inline-block">
                    <div  className="part p-1 d-inline-block text-center">
                        <div className="title">{Number(data.turnover).toFixed(2) }{appState.settings?.businessInfo?.currency?.symbol}</div>
                        <div className="subTitle">Turnover</div>
                    </div>
                    <div className="line d-inline-block"></div>
                    <div className="part p-1 d-inline-block text-center">
                        <div className="title">{data.nbOrders}</div>
                        <div className="subTitle">NB. Sale</div>
                    </div>
                </div>
                <div className="actions col-5 col-md-3 pt-2 pb-2 align-self-center text-end d-inline-block">
                    <SelectAction options={selectData} onChange={handleAction}/>
                </div>
            </div>
        </div>
    )
}