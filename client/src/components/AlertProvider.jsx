import { useState } from 'react';
import { AlertContext } from '../context/AlertContext'

function AlertProvider({children}) {
    const [isShow, setShow] = useState(false)
    const [alertText, setAlertText] = useState('Default alert text')
    const [variant, setVariant] = useState('primary')

    const showAlert = (text, variant = 'success', timeout = 2000)=>{
        setShow(true)
        setAlertText(text)
        setVariant(variant)
        setTimeout(()=>{setShow(false)}, timeout)
    }
    
    return ( <AlertContext value={{showAlert, isShow, alertText, variant}}>{children}</AlertContext> );
}

export default AlertProvider;