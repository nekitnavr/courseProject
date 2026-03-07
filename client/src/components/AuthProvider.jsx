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

    useEffect(()=>{
        // verifySession()
    },[])

    const verifySession = ()=>{
        if (!user) return
        axiosInstance.get('/api/verifyToken').then(res=>{
            setUser(res.data)
        }).catch(err=>{
            setUser(null)
            localStorage.removeItem('user');
        })
    }
    
    const handleUnauthorized = () => {
        logout()
    }
    
    useEffect(() => {
        window.addEventListener('unauthorized', handleUnauthorized);
        return () => window.removeEventListener('unauthorized', handleUnauthorized);
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
