import { Lang } from "../assets/js/lang"
// eslint-disable-next-line react/prop-types
export function PrimaryButton({label, className ,handleClick = null,type,disabled= false}) {
    return (
        disabled ? <button
            type={type}
            onClick={handleClick}
            className={className+" btn ps-3 pe-3 primaryBtn"}
            disabled
        >
            <Lang>{label}</Lang>
        </button>:<button
                type={type}
                onClick={handleClick}
                className={className + " btn ps-3 pe-3 primaryBtn"}
        >
            <Lang>{label}</Lang>
        </button> 
    )
}