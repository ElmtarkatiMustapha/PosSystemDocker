import { Routes, Route } from "react-router-dom";
import { ResetPSWStep1 } from "./Step1";
import { ResetPSWStep2 } from "./Step2";
import { ResetPSWStep3 } from "./Step3";
import { PrivateRoute } from "../../components/PrivateRoute";

export function ResetPassRoute() {
    return (
        <Routes>
            <Route index element={<ResetPSWStep1/>} />
            <Route path="/step2" element={<ResetPSWStep2/>}/>
            <Route path="/step3" element={<PrivateRoute component={<ResetPSWStep3 />} />}/>
        </Routes>
    )
}