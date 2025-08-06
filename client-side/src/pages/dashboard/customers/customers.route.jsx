import { Route, Routes } from "react-router-dom";
import { Customers} from ".";
import CustomersContext from "../../../context/customersContext";
import { SingleCustomer } from "./singlePage";

export function CustomersRoute() {
    return (
        <CustomersContext>
            <Routes>
                <Route index element={<Customers />} />
                <Route path="/:id" element={<SingleCustomer/>} />
            </Routes>
        </CustomersContext>
  );
}