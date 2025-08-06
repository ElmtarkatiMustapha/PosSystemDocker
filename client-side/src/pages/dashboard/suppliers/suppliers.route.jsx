import { Route, Routes } from "react-router-dom";
import { useAppState } from "../../../context/context";
import SuppliersContext from "../../../context/suppliersContext";
import { Suppliers } from ".";
import { SingleSupplier } from "./singlePage";


export function SuppliersRoute() {
  const state = useAppState();
  return (
    <SuppliersContext>
        <Routes>
            <Route index element={<Suppliers/>} />
            <Route path="/:id" element={<SingleSupplier/>} />
        </Routes>
    </SuppliersContext>
  );
}
