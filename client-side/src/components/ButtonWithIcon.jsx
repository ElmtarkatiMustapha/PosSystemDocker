import { Lang } from "../assets/js/lang";

export function ButtonWithIcon({label,handleClick = null,type,disabled= false, Icon}) {
    return (
        disabled ?
            <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                <button type={type} onClick={handleClick} disabled
                 style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                    }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    {Icon}<span className="ps-2 pe-2"><Lang>{label}</Lang></span>
                </button>
            </div>
            : 
            <div style={{verticalAlign:"middle"}} className="d-inline-block p-1">
                <button type={type} onClick={handleClick}
                 style={{
                        borderRadius: "29px",
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                    }} className="btn pt-1 pb-1 ps-2 pe-2 btn-primary">
                    {Icon}<span className="ps-2 pe-2"><Lang>{label}</Lang></span>
                </button>
            </div>
    )
}