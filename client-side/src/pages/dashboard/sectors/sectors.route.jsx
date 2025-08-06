import { Route, Routes } from "react-router-dom";
import { Sectors } from ".";
import SectorsContext from "../../../context/sectorsContext";
import { SingleSectors } from "./singlePage";

export function SectorsRoute() {
    return (
        <SectorsContext>
            <Routes>
                <Route index element={<Sectors />} />
                <Route path="/:id" element={<SingleSectors/>} />
            </Routes>
        </SectorsContext>
  );
}