import { Navigate } from "react-router-dom";
import { useAppState } from "../../context/context";
import { Component } from "react";
/**
 * logic of routes
 * 1) -PrivateRoute: for every user logged in the system
 * 2) -PrivatePosRoute: for user who have admin or cachier role
 * 3) -PrivateDeliveryRoute: for user who have admin or delivery role
 * 4) -PrivateManageRoute: for user who have admin or manager role 
 * 5) -PrivateAdminRoute: private for administrateur  
 */

/**
 * posPrivateRoute to protect Pos route: use must be connected
 * @param {component} component the page to load 
 * @returns if user logged in return component else redirect to the login page
 */
// eslint-disable-next-line react/prop-types
export function PrivateRoute({component}) {
    const state = useAppState();
    return state.currentUser ? component : <Navigate to="/login" replace />
}
/**
 * 
 * @param {Component} component 
 * @returns {Component} pos routes if user is admin or cachier
 * @returns {Navigate} not found page if else
 */
export function PrivatePosRoute({ component }) {
    const state = useAppState();
    if (state.currentUser) {
        if (state.userRoles.includes("cachier") || state.userRoles.includes("admin")) {
            return component;
        } else {
            if (state.userRoles.includes("delivery")) {
                return <Navigate to="/delivery" replace />;
            } else {
                return <Navigate to="/" replace />;
            }
        }
    } else {
        return <Navigate to="/login" replace />;
    }
}

/**
 * 
 * @param {Component} component 
 * @returns {Component} delivery route if user is admin or delivery
 * @returns {Navigate} not found page if else
 */
export function PrivateDeliveryRoute({ component }) {
    const state = useAppState();
    if (state.currentUser) {
        if (state.userRoles.includes("delivery") || state.userRoles.includes("admin")) {
            return component;
        } else {
            if (state.userRoles.includes("cachier")) {
                return <Navigate to="/pos" replace />;
            } else {
                return <Navigate to="/" replace />;
            }
        }
    } else {
        return <Navigate to="/login" replace />;
    }
}

/**
 * protect manager rout
 * @param {Component} component 
 * @returns {Component} manager routes if user is admin or manager
 * @returns {Navigate} not found page if else
 */
export function PrivateManageRoute({ component }) {
    const state = useAppState();
    if (state.currentUser) {
        if (state.userRoles.includes("manager") || state.userRoles.includes("admin")) {
            return component;
        } else {
            if (state.userRoles.includes("delivery")) {
                return <Navigate to="/delivery" replace />;
            } else if (state.userRoles.includes("cachier")) {
                return <Navigate to="/pos" replace />;
            } else {
                return <Navigate to="/notFound" replace />;
            }
        }
    } else {
        return <Navigate to="/login" replace />;
    }
}

/**
 * AdminPrivateRoute for protect admin route
 * @param {component} component: the page to render 
 * @returns if user logged in and admin return component else if cachier redirect to pos page
 * else redirect to login page
 */
// eslint-disable-next-line react/prop-types
export function PrivateAdminRoute({ component }) {
    const state = useAppState();
    if (state.currentUser && state.userRoles.includes("admin")) {
        return component;
    } else if (state.currentUser) {
        return <Navigate to="/notFound" replace/>
    } else {
        return <Navigate to="/login" replace/>
    }
}
//check if instaaled
export function CheckInstall({component}){
    const state = useAppState();
    return state.installed ? component : <Navigate to="/install" replace />
}
//check if not
export function CheckNotInstall({component}){
    const state = useAppState();
    return !state.installed ? component : <Navigate to="/" replace />
}
