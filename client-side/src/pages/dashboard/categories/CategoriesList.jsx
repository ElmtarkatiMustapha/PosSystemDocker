import { CategoryItem } from "./components/CategoryItem";
import { Paginate } from "./components/Paginate";
import { useCateState } from "../../../context/categoriesContext";

export function CategoriesList() {
    const cateState = useCateState();
    return (
        <div className="col-12 containeer-fluid p-0">
            <div className="row m-0 ">
                {/* Current categories */}
                {
                    cateState?.currentList?.map( item =><CategoryItem key={item.id} data={item}/>)
                }
            </div>
            <div className="row">
                {/* pagination heres */}
                {
                    Number(cateState.numberPages) > 0 && 
                    <Paginate/>
                }
            </div>
        </div>
    )
}