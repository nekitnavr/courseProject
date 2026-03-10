import { useContext, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert'
import { AlertContext } from '../context/AlertContext';

function AlertContainer() {
    const {showAlert, isShow, alertText, variant} = useContext(AlertContext)
    return ( <>
        <Alert 
            className='position-fixed start-50 translate-middle' 
            style={{zIndex: 1, top: 55, maxWidth: '900px'}}
            variant={variant}
            show={isShow}
        >
            {alertText}
        </Alert>
    </> );
}

export default AlertContainer;