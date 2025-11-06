import { Route, Routes, useNavigate } from "react-router-dom";
import { LoginRoute } from "./Login/login.route";
import { CheckInstall, CheckNotInstall, PrivateRoute } from "./components/PrivateRoute";
import { useEffect } from "react";
import { useAppAction, useAppState } from "../context/context";
import { LoggedRoute } from "./logged.route";
import api, { loginApi } from "../api/api";
import { InstallRoute } from "./installation/install.route";

export  function MainRoute() {
    /**logique
     * /dashboard if the user logged in and is admin 
     * /pos if the user is logged in and not admin
     * /login if the user not logged in
     */
    /**routes */
    const dispatch = useAppAction();
    const state = useAppState();
    // const navigate = useNavigate();
    /**
     * @desc this useEffect used to get user data from the server before load route
     */
    useEffect(() => {
        (async () => {
            
            try {
                //set device mode
                if (window.innerWidth <= 968) {
                    dispatch({ type: "SET_DEVICE", payload: true })
                } else {
                    dispatch({ type: "SET_DEVICE", payload: false })
                }
                //get lang data
                const langData = await fetch(`/langs/${state.currentLang}`)
                .then((res) => {
                    return res.json();
                })
                //set lang data
                dispatch({
                    type: "CHG_LANG_DATA",
                    payload: langData
                })
                
                const resInstall = await loginApi({
                    method: "get",
                    url: "/checkInstall",
                    // withCredentials:true
                })
                dispatch({
                    type: "TOGGLE_INSTALLED",
                    payload: resInstall?.data?.data?.installed
                })
                //get user
                const res = await loginApi({
                    method: "get",
                    url: "/user",
                    // withCredentials:true
                })
                const resSettings = await loginApi({
                    method: "get",
                    url: "/settings",
                    // withCredentials:true
                })
                //set user info
                dispatch({
                    type: "SET_USER",
                    payload: res.data.user
                })
                dispatch({
                    type: "SET_ROLES",
                    payload: res.data.roles
                })
                dispatch({
                    type: "SET_SETTINGS",
                    payload: resSettings.data.data
                })
                
                
                // set loeding false
                dispatch({type: "SET_LOADING", payload:false})
            } catch (err) {
                //set error
                dispatch({type: "SET_LOADING", payload:false})
                dispatch({ type: "SET_ERROR", payload: err?.response?.data?.message });
            }
        })();
    }, [])
    
    return (
        !state.loading &&
            <Routes>
                {/* login routes */}
                <Route path="/login/*" element={<CheckInstall component={<LoginRoute />}/> } />
                <Route path="/notFound" element={<h1>Not Found 404</h1>} />
                <Route path="/install" element={<CheckNotInstall component={<InstallRoute/>}/> } />
                {/* if the user logged in */}
                <Route path="/*" element={<CheckInstall component={ <PrivateRoute component={<LoggedRoute />} /> }/> } />
            </Routes>
    )
}