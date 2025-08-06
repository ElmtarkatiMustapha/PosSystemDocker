export function LoadingCart(){
    return (
        <div className="col-12 customBox loadingCart col-md-8 col-lg-6 container-fluid p-3">
            <div className="row m-0">
                <div className="col-12 col-md-4 pb-2">
                    <div className="pictureLoading d-flex justify-content-center pb-2">
                        <div
                            style={{
                                backgroundColor:"var(--backgroundColor)",
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
                        color: "white"
                    }} className="title p-1 text-center">
                        <div style={{height: "1.8rem"}} className=" fw-semibold"></div>
                    </div>
                </div>
                <div className="col-12 col-md-8 container-fluid ">
                    <div className="row m-0 pb-2">
                        <div className="col-7 p-0">
                            <h4 className="title"></h4>
                        </div>
                        <div className="col-5">
                            <div className="buttonLoading"></div>
                        </div>
                    </div>
                    <div className="row m-0">
                        <table >
                            <tr>
                                <th>
                                    <div className="subTitle"></div>
                                </th>
                                <td>
                                    <div className="subTitle"></div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div className="subTitle"></div>
                                </th>
                                <td>
                                    <div className="subTitle"></div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div className="subTitle"></div>
                                </th>
                                <td>
                                    <div className="subTitle"></div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div className="subTitle"></div>
                                </th>
                                <td>
                                    <div className="subTitle"></div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div className="subTitle"></div>
                                </th>
                                <td>
                                    <div className="subTitle"></div>
                                </td>
                            </tr>
                            
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}