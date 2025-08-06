export function LoadingHeader() {
    return (
        <div className="col-12 p-2 headerPage loadingHeader">
            <div style={{verticalAlign: "middle"}} className=" align-self-center p-2 d-inline-block">
                <div style={{height: "1.8rem"}} className="h3 m-0 title"></div>
            </div>
            <div style={{verticalAlign: "middle"}} className="controls d-inline-block align-content-center float-end ">
                <div className="p-1 d-inline-block">
                    <div className="buttonLoading"></div>
                </div>
            </div>
        </div>
    )
}