import { useAppState } from "../context/context"

export function Price({ children }) {
    const appState = useAppState();
    return (
        Number(children).toFixed(2) +" "+ appState.settings.businessInfo.currency.symbol
    )
}