import '../styles/Bar.css'
import Navbar from 'react-bootstrap/Navbar'
import Form from 'react-bootstrap/Form'
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { NavLink } from 'react-router';

function Bar() {
    const {user} = useAuth()
    const {toggleTheme, theme} = useTheme()
    
    return ( <>
    <Navbar className="bg-body-tertiary d-flex flex-row ps-4 pe-4 mb-4 justify-content-between gap-2">
        <div className='d-flex flex-row gap-3'>
            <NavLink as={NavLink} to="/" className={`${theme}`}>Browse</NavLink>
        </div>
        <div className=' d-flex flex-row gap-3 align-items-center'>
            <Form.Switch className='pt-1' type='switch' color='black' onChange={toggleTheme} checked={theme=='light'}></Form.Switch>
            
            {user ? (
                <>
                    <NavLink as={NavLink} to={`/user/${user.id}`} className={`${theme}`}>{user.email}</NavLink>
                </>
            ) : <NavLink as={NavLink} to="/login" className={`${theme}`}>Login</NavLink>}
        </div>
    </Navbar> 
    </> );
}

export default Bar;