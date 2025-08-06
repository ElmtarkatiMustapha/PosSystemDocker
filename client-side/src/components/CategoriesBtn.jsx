import { BsXLg } from "react-icons/bs";
import { FaShapes } from "react-icons/fa6";
/**
 * 
 * @param {CallbackFunction} handle toggle the state variable isOpen
 * @param {state} isOpen the state of the category menu 
 * @returns jsx component
 */
// eslint-disable-next-line react/prop-types
export function CategoriesBtn({handle,isOpen}) {
    return (
        <div className="category-btn position-fixed start-0 bottom-0 p-3 z-1">
            <button
                className="btn bg-success"
                onClick={handle}
            >
                {isOpen && <BsXLg/>}
                {!isOpen && <FaShapes/>}
            </button>
        </div>
    )
}