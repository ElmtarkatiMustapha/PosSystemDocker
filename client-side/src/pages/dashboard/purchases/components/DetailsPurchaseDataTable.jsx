import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../../components/CustomLoader";
import { useAppState } from "../../../../context/context";
import { Lang } from "../../../../assets/js/lang";

export function DetailsPurchaseDataTable({loading,state}) {
    const appState = useAppState();
    const columns = [
        {
            name: Lang({ children: "Barcode" }),
            selector: row => row.barcode,
            sortable: true,
        },
        {
            name: Lang({ children: "Product" }),
            selector: row => row.product,
            sortable: true
        },
        {
            name: Lang({ children: `P.Purchase(${appState.settings?.businessInfo?.currency?.symbol})` }),
            selector: row => row.price,
            sortable: true
        },
        {
            name: Lang({ children: "Qnt" }),
            selector: row => row.qnt,
            sortable: true
        },
        {
            name: Lang({ children: `Total(${appState.settings?.businessInfo?.currency?.symbol})` }),
            selector: row => Number(Number(row.total).toFixed(2)),
            sortable: true
        }
        
    ]
    
    return (
        <DataTable
            columns={columns}
            data={state?.currentItem?.details_purchase}
            customStyles={appState.tableStyle}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
        />
    )
}