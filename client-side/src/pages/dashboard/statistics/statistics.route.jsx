import { Route, Routes } from "react-router-dom";
import { Statistics } from ".";
import StatisticsContext from "../../../context/statisticsContext";

export function StatisticsRoute() {
    return (
        <StatisticsContext>
            <Routes>
                <Route index element={<Statistics />}/>
            </Routes>
        </StatisticsContext>
    )
}