import { Route, Routes } from "react-router-dom";
import { Install } from ".";
import "../../assets/css/dashboard/style.css";
export function InstallRoute(){
    return(
        <Routes>
            <Route index element={<Install/> } />
        </Routes>
    )
}