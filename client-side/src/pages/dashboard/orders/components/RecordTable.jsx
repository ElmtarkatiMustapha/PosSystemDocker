import DataTable from "react-data-table-component";
import { useAppAction, useAppState } from "../../../../context/context";
import { CustomLoader } from "../../../../components/CustomLoader";
import { Lang } from "../../../../assets/js/lang";
import { ButtonBlue } from "../../../../components/ButtonBlue";
import api from "../../../../api/api";


export function RecordTable({state,action,loading,setLoading}) {
    const appState = useAppState();
    const appAction = useAppAction(); 
    const columns = [
        {
            name: Lang({ children: "User" }),
            selector: row => row.user,
            sortable: true
        },
        {
            name: Lang({ children: "Barcode" }),
            selector: row => row.barcode,
            sortable: true
        },
        {
            name: Lang({ children: "Products" }),
            selector: row => String(row.product),
            sortable: true
        },
        {
            name: Lang({ children: "Qnt" }),
            selector: row => Number(row.qnt),
            sortable: false
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <ButtonBlue label={"Ready"} handleClick={()=>setReady(row.user_id,row.barcode )} type={"button"} />,
            sortable: false
        }
    ]
    /**
     * 
     * @param {Number} user user id 
     * @param {String} barcode product barcode
     * @todo send request to the server 
     * @todo update the data in front-end
     */
    const setReady = (user, barcode) => {
        setLoading(true);
        api({
            method: "post",
            url: "/setReadyOrder",
            data: {
                user,
                barcode
            },
            withCredentials: true
        }).then((res) => {
            return res.data
        }).then(res => {
            action({
                type: "SET_STORED_ITEMS",
                payload: res.data
            })
            setLoading(false)
        }).catch((err) => {
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        });
    }
    return (
        <div className="col-12 p-2 dataTableBox items">
            <DataTable
                columns={columns}
                data={state.allItems}
                customStyles={appState.tableStyle}
                pagination
                progressPending={loading}
                progressComponent={<CustomLoader />}
                />
        </div>
    )
}