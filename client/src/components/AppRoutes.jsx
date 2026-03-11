import Dashboard from './Dashboard.jsx'
import Login from "../components/Login.jsx";
import Signup from "../components/Signup.jsx";
import AuthLayout from './AuthLayout.jsx'
import User from './User.jsx'
import CreateInventory from './CreateInventory.jsx'
import MainLayout from './MainLayout.jsx'
import Inventory from './Inventory.jsx'
import TagPage from './TagPage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import { useAuth } from '../hooks/useAuth.jsx';
import NotFound from './NotFound.jsx';

function AppRoutes() {
    const {user} = useAuth()
    
    return ( <>
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<Dashboard />}/>
                <Route path='/user/:id' element={<User />} />
                <Route path='/inventory/:id' element={<Inventory />} />
                {user && <Route path='/createInventory' element={<CreateInventory />}/>}
                <Route path='/tag/:id' element={<TagPage/>}></Route>
            </Route>

            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>
            
            <Route path='*' element={<NotFound/>}/>
        </Routes>
    </> );
}

export default AppRoutes;