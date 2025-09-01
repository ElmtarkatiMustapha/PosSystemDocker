import { Chart } from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Lang } from "../assets/js/lang";

export function ChartPie({ title, data, labels, flag }) {
    const refChartContext = useRef(null);
    const [chartInstance, setChartInstance] = useState(null);
    useEffect(() => {
            if (chartInstance != null) {
                chartInstance.destroy();
            }
        setChartInstance(
                new Chart(refChartContext.current, {
                    type: 'pie',
                    data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: [
                            "rgba(255,99,132,0.5)",
                            "rgba(255, 190, 99, 0.5)",
                            "rgba(239, 255, 99, 0.5)",
                            "rgba(130, 255, 99, 0.5)",
                            "rgba(99, 250, 255, 0.5)",
                            "rgba(255, 99, 229, 0.5)",
                        ],
                        borderWidth: 1
                    }]
                    },
                    options: {
                        animation: false,
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: "right",
                                align:"center"
                            },
                        },
                    }
                })
            )
        },[data])
    return (
        <div className="chart-line p-0">
            <div className="chart-header  p-3">
                <div className="title text-center h3 m-0"><Lang>{title}</Lang></div>
                <div className="sub-title text-center h6"><Lang>Number of product by stock</Lang> </div>
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