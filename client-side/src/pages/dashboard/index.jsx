import { Lang } from "../../assets/js/lang";
import { useAppState } from "../../context/context";

export function Dashboard() {
    const appState = useAppState()
    String.prototype.toUpperCase
    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12 col-lg-8">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12 headerPage bg-primary color-white  p-3 mt-2">
                                    <h3><Lang>Welcome back</Lang>, <i>{String(appState.currentUser.name).toUpperCase()}</i></h3>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 col-lg-6"></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-4"></div>
                </div>
            </div>
        </>
    )
}



