export function LoadingCart() {
    const styleTitle = {
        height: "2rem",
        backgroundColor: "var(--backgroundColor)"
    }
    return (
        <div className="col-12 col-md-6 col-lg-5 p-2  loadingCart">
            <div className="container-fluid customBox p-3">
            <div className="row m-0">
                <div className=" container-fluid ">
                    <div className="row m-0 pb-4">
                        <div className="col-7 align-self-center p-0">
                            <h4 className="title m-0"></h4>
                        </div>
                        <div className="col-5 ">
                            <div className="buttonLoading float-end"></div>
                        </div>
                    </div>
                    <div className="row m-0">
                        <table className="m-0">
                            <tr>
                                <th>
                                    <div style={styleTitle} ></div>
                                </th>
                                <td>
                                    <div style={styleTitle}></div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div style={styleTitle}></div>
                                </th>
                                <td>
                                    <div style={styleTitle}></div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div style={styleTitle}></div>
                                </th>
                                <td>
                                    <div style={styleTitle}></div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div style={styleTitle}></div>
                                </th>
                                <td>
                                    <div style={styleTitle}></div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <div style={styleTitle}></div>
                                </th>
                                <td>
                                    <div style={styleTitle}></div>
                                </td>
                            </tr>
                            
                        </table>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}