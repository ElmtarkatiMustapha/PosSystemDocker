/* eslint-disable react/prop-types */
import { motion } from "framer-motion"
import "../../../assets/css/login.css"
import { LoginNav } from "../../Login/components/LoginNav"
export function InstallContainer({children}) {
    return (
        <>
            <div className="loginBackground">
                <div className="blur"></div>
            </div>
            <div style={{height:"100vh"}} className="container-fluid mainContainer pt-5">
                <LoginNav/>
                <main className="align-items-center h-100" >
                    <div className="container-fluid text-center">
                        <div className="row justify-content-center">
                            <div className="col-md-12 col-lg-11 col-xxl-10 pt-4 p-0">
                                <motion.div className="installBox p-2 "
                                    initial={{  y: 100 ,opacity:0}}
                                    animate={{  y: 0 ,opacity:1}}
                                    transition={{duration:0.5}}
                                >
                                    {children}
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
        
    )
}