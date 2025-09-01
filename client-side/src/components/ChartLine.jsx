import Chart from "chart.js/auto"
import { useEffect, useRef, useState } from "react"
import { Lang } from "../assets/js/lang";

export function ChartLine({ title, subTitle, dataX, dataY, flag }) {
    const refChartContext = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    useEffect(() => {
        if (chartInstance != null) {
            chartInstance.destroy();
        }
        setChartInstance(
            new Chart(refChartContext.current, {
                type: 'line',
                data: {
                labels: dataX,
                datasets: [{
                    data:dataY,
                    borderWidth: 1
                }]
                },
                options: {
                    animation: false,
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                    },
                    scales: {
                        y: {
                            stacked: true,
                            grid: {
                                display: false
                            }
                        },
                        x: {
                            stacked: true,
                            grid: {
                                display:false,
                            }
                        }
                    }
                    
                }
            })
        )
    },[dataX,dataY])
    return (
        <div className="chart-line p-0">
            <div className="chart-header pt-3 ps-3 pe-3">
                <div className="title text-center h3 m-0"><Lang>{title}</Lang></div>
                <div className="sub-title text-center h6">for {subTitle}</div>
            </div>
            <div className="chart-content ps-4 pe-4 ">
                <canvas style={{width:"100%!important"}} ref={refChartContext}></canvas>
            </div>
            <div className="chart-footer pt-3 text-end">
                <div className="flag text-white m-0 pt-2 pb-2 ps-3 pe-3 d-inline-block h5">{flag}</div>
            </div>
        </div>
    )
}