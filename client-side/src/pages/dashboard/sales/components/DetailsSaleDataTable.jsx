import DataTable from "react-data-table-component"
import { CustomLoader } from "../../../../components/CustomLoader"
import { Lang } from "../../../../assets/js/lang"
import { useAppState } from "../../../../context/context"

export const DetailsSaleDataTable = ({loading, state}) => {
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
            name: Lang({ children: "P.U" }),
            selector: row => row.unitPrice,
            sortable: true
        },
        {
            name: Lang({ children: "Qnt" }),
            selector: row => row.qnt,
            sortable: true
        },
        {
            name: Lang({ children: "Discount(%)" }),
            selector: row => Number(row.discount),
            sortable: true
        },
        {
            name: Lang({ children: `Total(${appState.settings.businessInfo.currency.symbol})` }),
            selector: row => Number(Number(row.total).toFixed(2)),
            sortable: true
        }
        
    ]
    
    return (
        <DataTable
            columns={columns}
            data={state?.currentItem?.details_order}
            customStyles={appState.tableStyle}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
        />
    )
}