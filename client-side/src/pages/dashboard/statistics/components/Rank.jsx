import { getImageURL } from "../../../../api/api";
import { useAppState } from "../../../../context/context";

export function Rank({picture,rank,name, total}) {
    const appState = useAppState();
    return (
        <div className="pb-3">
            <div className="rounded-4 bg-white align-content-center text-center p-2">
                <div className="container-fluid p-0 m-0">
                    <div className="row m-0 p-0">
                        <div className="col-4 align-self-center">
                            <div className="picture d-flex justify-content-center pb-2">
                                <div
                                    style={{
                                        backgroundImage:"url("+ getImageURL(picture? picture :"defaultProfile.jpg" )+")",
                                        backgroundSize: "cover",
                                        backgroundRepeat: "no-repeat",
                                        height: "4rem",
                                        width: "4rem"
                                    }}
                                    className="bg-image rounded-circle position-relative">
                                    <div style={{
                                        height: "1.5rem",
                                        width: "1.5rem",
                                        color: "white",
                                        backgroundColor: rank ==1 ?"#ffd700":rank == 2? "#C0C0C0" : "#CD7F32" ,
                                        alignContent: "center"
                                    }} className="flag  rounded-circle text-center position-absolute top-0 end-0 fw-bold ">#{ rank}</div>
                                </div>
                            </div>
                        </div>
                        <div className="col-8 align-self-center ">
                            <div style={{
                                borderRadius: "8px",
                                color: "white"
                            }} className="bg-secondary p-1 text-center">
                                <div className="title fw-semibold">{name}</div>
                            </div>
                            <div className="text-start fw-semibold">
                                Total: {total}{appState.settings?.businessInfo?.currency?.symbol}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}