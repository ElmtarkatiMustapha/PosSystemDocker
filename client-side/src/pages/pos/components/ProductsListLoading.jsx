import { useAppState } from "../../../context/context";
import { ProductItemLoading } from "./ProductItemLoading";

export function ProductsListLoading() {
    const appState = useAppState()
    return (
        Array.from({ length: appState.settings?.posSettings?.productPerPage }, (_, i) => (
            <ProductItemLoading key={i}/>
        ))
    )
}