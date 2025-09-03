import { LoadingHeader2 } from "../../../components/LoadingHeader2";

export function LoadingPage() {
    return (
        <div className="container-fluid p-2">
            <div className="row m-0">
                <LoadingHeader2 />
            </div>
            <div className="row m-0 search-loading">
                <div className="col-12 text-end pt-2 pb-2">
                    <form style={{verticalAlign:"middle"}} className="d-inline-block pe-1 ps-1">
                        <input type="text" className="form-control form-control-lg"  placeholder={"Loading..."} />
                    </form>
                    <div style={{verticalAlign:"middle"}} className="d-inline-block pe-1 ps-1">
                        <div className="SearchButtonLoading"></div>
                    </div>
                </div>
            </div>
            <div className="row m-0">
                {/* <LoadingContent/> */}
            </div>
        </div>
    )
}