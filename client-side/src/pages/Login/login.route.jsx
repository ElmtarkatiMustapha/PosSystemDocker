import { Route, Routes } from "react-router-dom";
import { LoginForm } from "./components/LoginForm";
import { ResetPassRoute } from "./resetPassword/ResetPass.route";
import { LoginContainer } from "./components/LoginContainer";

export function LoginRoute() {
    /**logique of login 
     * /login load login form
     * /login/resetpass load reset password routes
     */
    // const state = useAppState();
    // const navigate = useNavigate();
    // useEffect(() => {
    //     if (state.currentUser) {
    //         navigate("/");
    //     }
    // },[])

    return (
        <LoginContainer>
            <Routes>
                <Route index element={<LoginForm />} />
                <Route path="/resetpass/*" element={<ResetPassRoute/>}/>
            </Routes>
        </LoginContainer>
    )
}