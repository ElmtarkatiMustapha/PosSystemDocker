import { Route, Routes } from "react-router-dom";
import { Products } from ".";
import { SingleProduct } from "./singlePage";
import ProductsContext from "../../../context/productsContext";
import { useAppState } from "../../../context/context";
import { Sidebar } from "../components/Sidebar";
import { MobileSidebar } from "../components/mobile/MobileSidebar";

export function ProductsRoute() {
  const state = useAppState();
  return (
    <>
      {/* {!state.isMobile && <Sidebar />}
      {state.isMobile && <MobileSidebar/>} */}
      {/* <main style={!state.isMobile?{marginLeft: "5rem"}: {}} className="">   */}
        <ProductsContext>
          <Routes>
            <Route index element={<Products />} />
            <Route path="/:id" element={<SingleProduct />} />
          </Routes>
        </ProductsContext>
      {/* </main> */}
    </>
  );
}
