import { Route, Routes } from "react-router-dom";

export function CustomRoute(){
    return (
        <Routes>
            <Route path="/purchase/" element={"purchase"} />
            <Route path="/return/" element={"purchase"} />
        </Routes>
    )
}