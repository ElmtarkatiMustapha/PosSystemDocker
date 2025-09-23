import { Route, Routes } from "react-router-dom";
import { CashRegisterSession } from ".";
import CashRegisterSessionsContext from "../../../context/cashRegisterSessionContext";
import { SingleCashRegisterSession } from "./singlePage";

export function CashRegisterSessionsRoutes() {
  return (
    <CashRegisterSessionsContext>
      <Routes>
        <Route index element={<CashRegisterSession/>} />
        <Route path="/:id" element={<SingleCashRegisterSession />} />
      </Routes>
    </CashRegisterSessionsContext>
  );
}
