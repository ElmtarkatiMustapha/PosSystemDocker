import { LoadingHeader2 } from "../../../../components/LoadingHeader2";
import { LoadingContent } from "./LoadingContent";

export function LoadingPage() {
    return (
        <div className="container-fluid pt-2">
            <div className="row m-0">
                <LoadingHeader2 />
            </div>
            <div className="row m-0">
                <LoadingContent/>
            </div>
        </div>
    )
}