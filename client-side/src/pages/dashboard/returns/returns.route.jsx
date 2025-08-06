import { Route, Routes } from "react-router-dom";
import ReturnContext from "../../../context/returnContext";
import { Returns } from ".";

export function ReturnRoute() {
    return (
        <ReturnContext>
            <Routes>
                <Route index element={<Returns/>}/>
                <Route path="/:id" element={"hello from single return page "}/>
            </Routes>
        </ReturnContext>
    )
}