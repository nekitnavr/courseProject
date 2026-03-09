import { useEffect, useRef, useState } from 'react';
import { AlertContext } from '../context/AlertContext'

function AlertProvider({children}) {
    const [isShow, setShow] = useState(false)
    const [alertText, setAlertText] = useState('Default alert text')
    const [alertVariant, setAlertVariant] = useState('primary')
    const timeoutRef = useRef()

    const stopTimeout = ()=>{
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }

    useEffect(()=>{
        return ()=>{
            stopTimeout()
        }
    },[])
    
    const showAlert = (text, variant = 'success', timeout = 2000)=>{
        stopTimeout()
        setShow(true)
        setAlertText(text)
        setAlertVariant(variant)
        timeoutRef.current = setTimeout(()=>{
            setShow(false)
            timeoutRef.current = null
        }, timeout)
    }
    
    return ( <AlertContext value={{showAlert, isShow, alertText, variant: alertVariant}}>{children}</AlertContext> );
}

export default AlertProvider;