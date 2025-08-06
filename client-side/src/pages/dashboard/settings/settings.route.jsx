import { Route, Routes } from "react-router-dom";
import { Settings } from ".";
import SettingsContext from "../../../context/settingsContext";

export function SettingsRoute() {
    return (
        <SettingsContext>
            <Routes>
                <Route index element={<Settings />} />
                
            </Routes>
        </SettingsContext>
    )
}