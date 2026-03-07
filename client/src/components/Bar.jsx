import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import { NavLink } from 'react-router';
import Nav from 'react-bootstrap/Nav'
import { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Button from 'react-bootstrap/esm/Button';
import { useTheme } from '../hooks/useTheme';

function Bar() {
    const {user, logout} = useAuth()
    const {toggleTheme} = useTheme()
    
    return ( <>
    <Navbar className="bg-body-tertiary d-flex flex-row ps-4 pe-4 mb-4">
        <div className='d-flex flex-row gap-3'>
            <Nav.Link as={NavLink} to="/">Browse</Nav.Link>
            {user && <Nav.Link as={NavLink} to="/createInventory">Create inverntory</Nav.Link>}
        </div>
        <div className='ms-auto d-flex flex-row gap-3 align-items-center'>
            <Button onClick={toggleTheme}>Toggle theme</Button>
            
            {user ? (
                <>
                    <Button onClick={logout} variant='danger'>Logout</Button>
                    <Nav.Link as={NavLink} to={`/user/${user.id}`} >{user.email}</Nav.Link>
                </>
            ) : <Nav.Link as={NavLink} to="/login" className='ms-auto'>Login</Nav.Link>}
        </div>
    </Navbar> 
    </> );
}

export default Bar;