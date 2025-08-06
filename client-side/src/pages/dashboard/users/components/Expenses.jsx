import DataTable from "react-data-table-component";
import { CustomLoader } from "../../../../components/CustomLoader";
import { ChartLineLoading } from "../../../../components/ChartLineLoading";
import { ChartLine } from "../../../../components/ChartLine";
import { useAppState } from "../../../../context/context";
import { Lang } from "../../../../assets/js/lang";
import { SelectAction } from "../../../../components/SelectAction";

export function Expenses({ state, loading }) {
    const appState = useAppState();
    const columns = [
        {
            name: Lang({ children: "Id" }),
            selector: row => row.id,
            sortable: true
        },
        {
            name: Lang({ children: "Title" }),
            selector: row => row.title,
            sortable: true
        },
        {
            name: Lang({ children: "Total" }),
            selector: row => Number(Number(row.total).toFixed(2)),
            sortable: true
        },
        {
            name: Lang({ children: "Date" }),
            selector: row => row.date,
            sortable: true
        },
        {
            name: Lang({ children: "Actions" }),
            cell: row => <SelectAction options={appState.selectData} id={row.id} onChange={()=>null} />,
            sortable: false
        },
    ]
    const handleActions = ()=>{}
    return (
        <>
            <div className="col-12 col-lg-6 p-2 container-fluid">
                <div className="row m-0">
                    <div className="col-12 customBox">
                        <div className="h3 text-center pt-3 ps-3 pe-3 m-0 w-100"><Lang>Costs</Lang></div>
                        <DataTable
                            columns={columns}
                            data={state?.costs}
                            customStyles={appState.tableStyle}
                            pagination
                            progressPending={loading}
                            paginationPerPage={4}
                            progressComponent={<CustomLoader />}
                        />
                    </div>
                </div>
            </div>
            <div className="col-12 col-lg-6 p-2 container-fluid">
                <div className="row m-0">
                    <div className="col-12 p-0">
                        {loading ? <ChartLineLoading/>:
                            <ChartLine title={"Costs"} subTitle={state?.filterTitle} dataX={state?.costsStatistics?.dataX} dataY={state?.costsStatistics?.dataY} flag={Number(state?.costsStatistics?.dataY.reduce((prev,curr)=>prev+curr)).toFixed(2)} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}