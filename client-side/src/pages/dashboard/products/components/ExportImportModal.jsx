import { useRef, useState } from "react";
import { Lang } from "../../../../assets/js/lang";
import { Spinner } from "../../../../components/Spinner";
import { useAppAction } from "../../../../context/context";
import { useProductsAction } from "../../../../context/productsContext";
import api from "../../../../api/api";
import { ButtonBlue } from "../../../../components/ButtonBlue";

export function ExportImportModal() {
    const appAction = useAppAction();
    const [loading,setLoading] = useState(false);
    const productsAction = useProductsAction();
    const uploadRef = useRef(null)
    const handleClose = () => {
        productsAction({
            type: "TOGGLE_EXPORT_IMPORT_MODAL",
            payload: false,
        })
    }
    //handle export 
    const exportData = (e)=>{
        //get the list of product on csv
        setLoading(true)
        api({
            method:"post",
            url:"products/export",
            responseType: "blob",
            //withCredentials: true,
        }).then((res)=>{
            //export data 
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;

            // Extraire le nom du fichier si dispo sinon par défaut
            const contentDisposition = res.headers["content-disposition"];
            let fileName = "products_export.csv";
            if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+)"?/);
            if (match?.[1]) {
                fileName = match[1];
            }
            }

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            setLoading(false)
        }).catch((err)=>{
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    } 
    //handle upload 
    const uploadData = ()=>{
        if(uploadRef.current.files[0] != undefined){
            const formData = new FormData();
            formData.append("file", uploadRef.current.files[0]);
            setLoading(true)
            api({
                method:"post",
                url:"products/import",
                data: formData
            }).then((res)=>{
                //export data 
                uploadRef.current.value = "";
                setLoading(false)
                appAction({
                    type: "SET_SUCCESS",
                    payload: "imported with success"
                })
            }).catch((err)=>{
                appAction({
                    type: "SET_ERROR",
                    payload: err?.response?.data?.message
                })
                setLoading(false)
            })
        }else{
             appAction({
                type: "SET_ERROR",
                payload: "Upload file first"
            })
        }
        
    }
    //handle download template
    const downloadTemplate = ()=>{
        setLoading(true)
        api({
            method:"post",
            url:"products/template",
            responseType: "blob",
            //withCredentials: true,
        }).then((res)=>{
            //export data 
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;

            // Extraire le nom du fichier si dispo sinon par défaut
            const contentDisposition = res.headers["content-disposition"];
            let fileName = "products_template.csv";
            if (contentDisposition) {
            const match = contentDisposition.match(/filename="?(.+)"?/);
            if (match?.[1]) {
                fileName = match[1];
            }
            }

            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            setLoading(false)
        }).catch((err)=>{
            appAction({
                type: "SET_ERROR",
                payload: err?.response?.data?.message
            })
            setLoading(false)
        })
    }
    

    
    
    return (
        <div className="editModal modal z-2 d-block" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog modal-fullscreen-md-down  modal-dialog-scrollable">
                <form  className="modal-content">
                    <div className="modal-header">
                        <div className="modal-title">
                            <div className="title h3 m-0"><Lang>Export / Import</Lang> :</div>
                        </div>
                        <button type="button" onClick={handleClose} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Export Product</Lang> : {loading && <Spinner/>}</label>
                            <div className="pt-2 pb-2">
                                <ButtonBlue label={"Export"} handleClick={exportData} disabled={loading} type={"button"} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Import Product</Lang> : {loading && <Spinner/>}</label>
                            <input type="file" ref={uploadRef}  disabled={loading} name="name"  className="form-control" accept=".csv" placeholder={Lang({ children: "upload CSV file" })}   />
                            <div className="pt-2 pb-2">
                                <ButtonBlue label={"Upload"} handleClick={uploadData} disabled={loading} type={"button"} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="form-label h5"><Lang>Download Template</Lang> : {loading && <Spinner/>}</label>
                            <div className="pt-2 pb-2">
                                <ButtonBlue label={"Download"} handleClick={downloadTemplate} disabled={loading} type={"button"} />
                            </div>
                        </div>
                        
                    </div>
                </form>
            </div>
        </div>
    )
}
