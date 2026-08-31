import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import AuthLoadingScreen from "./AuthLoadingScreen";
import AppHeader from "../../../components/AppHeader";

const Protected = ({children}) => {
    const { loading,user } = useAuth()


    if(loading){
        return <AuthLoadingScreen />
    }

    if(!user){
        return <Navigate to={'/login'} />
    }

    return (
        <>
            <AppHeader />
            {children}
        </>
    )
}

export default Protected