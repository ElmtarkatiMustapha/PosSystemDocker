import { Route, Routes } from "react-router-dom";
import { Categories } from ".";
import { SingleCategory } from "./singlePage";
import CategoriesContext from "../../../context/categoriesContext";

export function CategoriesRoutes() {
  return (
    <CategoriesContext>
      <Routes>
        <Route index element={<Categories />} />
        <Route path="/:id" element={<SingleCategory />} />
      </Routes>
    </CategoriesContext>
  );
}
