
import { Route, Routes } from "react-router-dom";
import StocksContext from "../../../context/stocksContext";
import { Stocks } from ".";

export function StocksRoute() {
    return (
        <StocksContext>
            <Routes>
                <Route index element={<Stocks/>} />
            </Routes>
        </StocksContext>
  );
}