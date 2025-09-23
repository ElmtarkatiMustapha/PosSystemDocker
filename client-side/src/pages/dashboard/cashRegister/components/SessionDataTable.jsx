import DataTable from "react-data-table-component"
import { CustomLoader } from "../../../../components/CustomLoader"
import { Lang } from "../../../../assets/js/lang"
import { SelectAction } from "../../../../components/SelectAction"
import { useAppState } from "../../../../context/context"

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
]


export const SessionDataTable = ({loading, state, handleActions}) => {
    const appState = useAppState();
    
    const columns = [
        {
            name: Lang({ children: "id" }),
            selector: row => row.id,
            sortable: true,
        },
        {
            name: Lang({ children: "User" }),
            selector: row => row.user,
            sortable: true
        },
        {
            name: Lang({ children: "Opened at" }),
            selector: row => row.opened_at,
            sortable: true
        },
        {
            name: Lang({ children: "Closed at" }),
            selector: row => row.closed_at? row.closed_at:"",
            sortable: true
        },
        {
            name: Lang({ children: `Opening amount` })+`(${appState.settings?.businessInfo?.currency?.symbol})`,
            selector: row => Number(Number(row.opening_amount).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: `Closing amount` })+`(${appState.settings?.businessInfo?.currency?.symbol})`,
            selector: row => Number(Number(row.closing_amount).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Status" }),
            selector: row => row.closed_at ==null?"open":"close" ,
            sortable: true,
            conditionalCellStyles: [
                {
                    when: row => row.closed_at == null,
                    style: {
                        color: 'var(--success)',
                        fontWeight: "bold",
                    },
                },
                {
                    when: row => row.closed_at != null,
                    style: {
                        color: 'var(--bs-warning)',
                        fontWeight: "bold",
                    },
                }
            ]
        },
        {
            name: Lang({ children: "Note" }),
            selector: row => row.note,
            sortable: true
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <SelectAction options={SelectOption1} id={row.id} onChange={handleActions} />,
            sortable: false
        },
    ]
    
    return (
        <DataTable
            columns={columns}
            data={state?.allItems}
            customStyles={appState?.tableStyle}
            pagination
            progressPending={loading}
            progressComponent={<CustomLoader />}
        />
    )
}