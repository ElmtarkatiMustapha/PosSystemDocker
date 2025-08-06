import { Route, Routes } from "react-router-dom";
import SpentsContext from "../../../context/spentsContext";
import { Spents } from ".";


export function SpentsRoute() {
    return (
        <SpentsContext>
            <Routes>
                <Route index element={<Spents/>}/>
            </Routes>
        </SpentsContext>
    )
}