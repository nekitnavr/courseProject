import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router";
import axiosInstance from "../api/axiosConfig";

export default function AuthProvider({children}) {
    const nav = useNavigate()
    
    const [user, setUser] = useState(()=>{
        const savedUser = JSON.parse(localStorage.getItem('user'))
        return savedUser ? savedUser : null
    })

    // useEffect(()=>{
    //     console.log(user);
    // },[user])

    const updateSession = ()=>{
        if (!user) return
        axiosInstance.get('/api/updateToken').then(res=>{
            login(res.data)
        }).catch(err=>{
            setUser(null)
            localStorage.removeItem('user');
        })
    }
    
    const handleUnauthenticated = () => {
        logout()
    }
    const handleUnauthorized = () => {
        console.log('Unauthorized!');
        updateSession()
    }
    
    useEffect(() => {
        window.addEventListener('unauthenticated', handleUnauthenticated)
        window.addEventListener('unauthorized', handleUnauthorized)
        return () => {
            window.removeEventListener('unauthenticated', handleUnauthenticated)
            window.removeEventListener('unauthorized', handleUnauthorized)
        }
    }, [])

    const login = (user)=>{
        setUser(user)
        localStorage.setItem('user', JSON.stringify(user))
    }

    const logout = async ()=>{
        await axiosInstance.post('/api/logout');
        setUser(null);
        localStorage.removeItem('user');
        nav('/');
    }
    
    return ( <AuthContext value={{user, login, logout}}>{children}</AuthContext> );
}
