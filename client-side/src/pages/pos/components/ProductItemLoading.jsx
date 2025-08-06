import { motion } from "framer-motion"
import { useAppState } from "../../../context/context"
export function ProductItemLoading() {
    const appState = useAppState();
    return (
        <div style={appState.isMobile?{minWidth:"14rem"} : {
            minWidth: "14rem",
            maxWidth: "18rem"
        }} className="col p-2">
            <div
                style={{
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor:"pointer"
                }}
                className="elem container-fluid p-0 bg-white"
            >
                <motion.div
                    animate={{
                        opacity: [1,0.5,1]
                    }}
                    transition={{
                        duration: 2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay:0
                    }}
                    className="row m-0 p-0">
                    <div className="col-9 p-2">
                        <div style={{ height:"1rem", borderRadius: "5px"  }} className="barcode mb-1 bg-dark-subtle w-50"></div>
                        <div style={{ height:"1.1rem", borderRadius: "5px"}}  className="title mb-1 bg-dark-subtle w-100"></div>
                        <div style={{ height:"1rem", borderRadius: "5px" }} className="price mb-1 bg-dark-subtle w-75"></div>
                        <div style={{ height:"1rem", borderRadius: "5px" }} className="price mb-1 bg-dark-subtle w-75"></div>
                    </div>
                    <div
                        style={{
                            borderRadius: "50px 0px  0px 50px",
                            overflow: "hidden",
                            backgroundPosition: "center",
                            backgroundSize:"cover"
                        }}
                        className="col-3 p-0 m-0 bg-dark-subtle">
                    </div>
                </motion.div>
            </div>
        </div>
    )
}