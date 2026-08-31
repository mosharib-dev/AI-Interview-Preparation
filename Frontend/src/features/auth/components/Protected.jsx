import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import AuthLoadingScreen from "./AuthLoadingScreen";
<<<<<<< HEAD
import AppHeader from "../../../components/AppHeader";
=======
>>>>>>> 922e67fa2506a5acdf70891b630d6eba2c788f53

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
