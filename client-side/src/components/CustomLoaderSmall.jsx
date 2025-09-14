import { Lang } from "../assets/js/lang";

export function CustomLoaderSmall() {
    return (
        <>
            <div  className="spinner-border m-2" style={{width:"3rem", height:"3rem",verticalAlign: "middle"}} role="status">
                <span className="sr-only"></span>
            </div>
            <div style={{verticalAlign: "middle"}} className="fs-5 d-none d-md-inline-block"><Lang>Loading...</Lang></div>
        </>
    )
}