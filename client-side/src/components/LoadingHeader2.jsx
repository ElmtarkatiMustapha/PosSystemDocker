export function LoadingHeader2() {
    return (
        <div className="col-12 p-2 headerPage loadingHeader2">
            
            <div style={{verticalAlign: "middle"}} className=" align-self-center p-2 d-inline-block">
                <div className="h5 m-0 title"></div>
            </div>
            <div style={{verticalAlign: "middle"}} className="controls d-inline-block align-content-center float-end ">
                <div className="p-1 d-inline-block">
                    <div className="buttonLoading"></div>
                </div>
                <div className="p-1 d-inline-block">
                    <div className="buttonLoading"></div>
                </div>
            </div>
        </div>
    )
}