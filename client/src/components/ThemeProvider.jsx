import { useEffect, useState } from "react";
import { ThemeContext } from '../context/ThemeContext'

export function ThemeProvider({children}) {
    const [theme, setTheme] = useState(()=>{
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme) return savedTheme
        else return 'light'
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme]);

    const toggleTheme = ()=>{
        setTheme(theme == 'light' ? 'dark' : 'light')
    }
    
    return (<ThemeContext value={{theme, toggleTheme}}>{children}</ThemeContext>);
}