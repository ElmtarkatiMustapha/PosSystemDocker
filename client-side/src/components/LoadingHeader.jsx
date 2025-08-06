export function LoadingHeader() {
    return (
        <div className="col-12 p-2 headerPage loadingHeader">
            <div style={{verticalAlign: "middle"}} className="image align-self-center  p-2 d-inline-block">
                <div
                    style={{
                        backgroundColor:"var(--backgroundColor)",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        height: "3.5rem",
                        width: "3.5rem",
                        borderRadius: "50px",
                        overflow: "hidden"
                    }}
                    className="bg-image">
                </div>
            </div>
            <div style={{verticalAlign: "middle"}} className=" align-self-center p-2 d-inline-block">
                <div className="h5  title"></div>
                <div className="subTitle"></div>
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