export function ChartLineLoading() {
    return (
        <div className="chart-line chart-line-loading p-0">
            <div className="chart-header pt-3 ps-3 pe-3">
                <div className="title text-center h3 "></div>
                <div className="sub-title text-center h6"></div>
            </div>
            <div className="chart-content ps-4 pe-4 ">
                <canvas style={{width:"100%!important"}}></canvas>
            </div>
            <div className="chart-footer pt-3 m-0 text-end">
                <div className="flag text-white m-0 pt-2 pb-2 ps-3 pe-3 d-inline-block h5"></div>
            </div>
        </div>
    )
}