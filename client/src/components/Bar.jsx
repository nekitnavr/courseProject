import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import { NavLink } from 'react-router';
import Nav from 'react-bootstrap/Nav'
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from 'react-bootstrap/esm/Button';
import { useTheme } from '../hooks/useTheme';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';

function Bar() {
    const {user, logout} = useAuth()
    const {toggleTheme, theme} = useTheme()
    
    return ( <>
    <Navbar className="bg-body-tertiary d-flex flex-row ps-4 pe-4 mb-4 justify-content-between gap-2">
        <div className='d-flex flex-row gap-3'>
            <Nav.Link as={NavLink} to="/">Browse</Nav.Link>
        </div>
        <div className=' d-flex flex-row gap-3 align-items-center'>
            {/* <Button onClick={toggleTheme}>Toggle theme</Button> */}
            <Form.Switch className='pt-1' type='switch' color='black' onChange={toggleTheme} checked={theme=='light'}></Form.Switch>
            
            {user ? (
                <>
                    
                    <Nav.Link as={NavLink} to={`/user/${user.id}`} >{user.email}</Nav.Link>
                </>
            ) : <Nav.Link as={NavLink} to="/login" className='ms-auto'>Login</Nav.Link>}
        </div>
    </Navbar> 
    </> );
}

export default Bar;