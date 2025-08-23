import DataTable from "react-data-table-component";
import { Lang } from "../../../../assets/js/lang";
import { useAppState } from "../../../../context/context";
import { CustomLoader } from "../../../../components/CustomLoader";
import { SelectAction } from "../../../../components/SelectAction";

const SelectOption1 = [
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
        },
        {
            name: "Download Invoice",
            value: "download_invoice"
        },
        {
            name: "Send to Customer",
            value: "send"
        }
]

const SelectOption2 = [
        {
            name: "View",
            value: "view"
        },
        {
            name: "Download Invoice",
            value: "download_invoice"
        },
        {
            name: "Send to Customer",
            value: "send"
        }
    ]
export function SalesDataTable({ loading, state, handleActions }) {
    const appState = useAppState()
    const columns = [
            {
                name: Lang({ children: "id" }),
                selector: row => row.id,
                sortable: true,
            },
            {
                name: Lang({ children: "Customer" }),
                selector: row => row.customer,
                sortable: true
            },
            {
                name: Lang({ children: "Type" }),
                selector: row => row.type,
                sortable: true
            },
            {
                name: Lang({ children: "Qnt" }),
                selector: row => row.qnt,
                sortable: true
            },
            {
                name: Lang({ children: "Return Qnt" }),
                selector: row => row.return_qnt,
                sortable: true
            },
            {
                name: Lang({ children: `Total(${appState.settings.businessInfo.currency.symbol})` }),
                selector: row => Number(Number(row.total).toFixed(2)),
                sortable: true
            },
            {
                name: Lang({ children: `Discount(${appState.settings.businessInfo.currency.symbol})` }),
                selector: row => Number(Number(row.discount).toFixed(2)),
                sortable: true
            },
            {
                name: Lang({ children: "Date" }),
                selector: row => row.date,
                sortable: true
            },
            {
                name: Lang({ children: "Status" }),
                selector: row => row.status ,
                sortable: true,
                conditionalCellStyles: [
                {
                    when: row => row.status == "delivered",
                    style: {
                        color: 'var(--success)',
                        fontWeight: "bold",
                    },
                },
                {
                    when: row => row.status == "pending",
                    style: {
                        color: 'var(--bs-warning)',
                        fontWeight: "bold",
                    },
                },
            ]
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <SelectAction options={row.status ==="delivered"?SelectOption2:SelectOption1 } id={row.id} onChange={handleActions} />,
            sortable: false
        }
        ]
    return (
        <DataTable
            columns={columns}
            data={state.allItems}
            customStyles={appState.tableStyle}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
        />
    )
}