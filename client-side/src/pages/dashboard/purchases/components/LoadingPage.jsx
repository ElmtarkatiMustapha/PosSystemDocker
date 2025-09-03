import { LoadingHeader2 } from "../../../../components/LoadingHeader2";

export function LoadingPage() {
    return (
        <div className="container-fluid pt-2">
            <div className="row m-0">
                <LoadingHeader2 />
            </div>
            <div className="row m-0">
                <div className="col-sm-12 col-md-6 col-lg-4 p-3 ">
                    <div className="rounded-4 bg-white h-100 align-content-center text-center p-3">
                        <div className="align-content-center d-block m-0 p-0">
                            <div className="loading-title d-inline-block h5 m-0"></div>
                        </div>
                        <div className="loading-data h3 d-inline-block m-0 mt-2 mb-2"></div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-4 p-3 ">
                    <div className="rounded-4 bg-white h-100 align-content-center text-center p-3">
                        <div className="align-content-center d-block m-0 p-0">
                            <div className="loading-title d-inline-block h5 m-0"></div>
                        </div>
                        <div className="loading-data h3 d-inline-block m-0 mt-2 mb-2"></div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-4  p-3 ">
                    <div className="rounded-4 bg-white text-center align-content-center h-100 p-3">
                        <div className="loading-button d-inline-block"></div>
                    </div>
                </div>
            </div>
            
        </div>
    )
}