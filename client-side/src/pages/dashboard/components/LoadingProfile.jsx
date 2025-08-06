export function LoadingProfile() {
    return (
        <div className="col-12 col-md-6 col-lg-3 p-2 align-self-center">
            <div className="pictureLoading loadingCart d-flex justify-content-center pb-2">
                <div
                    style={{
                        backgroundColor:"white",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        height: "10rem",
                        width: "10rem",
                        borderRadius: "100px",
                        overflow: "hidden"
                    }}
                    className="bg-image ">

                </div>
            </div>
            <div style={{
                borderRadius: "8px",
                color: "white",
                backgroundColor: "white"
            }} className="title p-1 text-center">
                <div style={{height: "1.8rem"}} className=" fw-semibold"></div>
            </div>
        </div>
    )
}