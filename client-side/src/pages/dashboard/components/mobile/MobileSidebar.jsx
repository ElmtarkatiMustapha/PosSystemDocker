/**
 * @usage this  component is the main component of sidebar
 * @item  start btn
 * @item  sidebar content
 * @item  isOpen and isManage State
 */
import { useState } from "react"
import { BsGridFill, BsXLg } from "react-icons/bs"
import "../../../../assets/css/dashboard/mobileSidebar.css"
import { AnimatePresence } from "framer-motion"
import { MobileSidebarContainer } from "./MobileSidebarContainer"
export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isManage,setIsManage] = useState(false)
    const handleIsOpen = () => {
        if (isOpen) {
            setIsManage(false)
        }
        setIsOpen(!isOpen);
    }
    const handleIsManage = () => {
        setIsManage(!isManage)
    }
    
    return (
        <>
            <AnimatePresence>
                {isOpen && <MobileSidebarContainer isOpen={isOpen} isManage={isManage} handleOpen={handleIsOpen} handleManage={handleIsManage}  />}
            </AnimatePresence>
            <div className="mobile-sidebar-open-btn z-2 position-fixed">
                <button onClick={handleIsOpen} className="btn">
                    {!isOpen && <BsGridFill />}
                    {isOpen && <BsXLg />}
                </button>
            </div>
        </>
    )
}

