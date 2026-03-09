import { useEffect, useState } from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router'
import axiosInstance from '../api/axiosConfig';
import Spinner from 'react-bootstrap/Spinner'
import InventoriesTable from './InventoriesTable';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { useAuth } from '../hooks/useAuth';
import AdminPage from './AdminPage';
import Button from 'react-bootstrap/esm/Button';

function User() {
    let {id: idFromParams} = useParams()
    const {user: currentUser, logout} = useAuth()
    const nav = useNavigate()

    const [userInventories, setUserInventories] = useState()
    const [accessibleInventories, setAccessibleInventories] = useState()
    const [user, setUser] = useState()

    const fillUser = async ()=>{
        axiosInstance.get('/api/user', {params: {id: idFromParams}}).then(res=>{
            setUser(res.data)
        })
    }
    const fillInventories = async()=>{
        axiosInstance.get('/api/user/inventories', {params: {userId: idFromParams}}).then(res=>{
            setUserInventories(res.data)
        })
    }
    const fillAccessibleInventories = async()=>{
        axiosInstance.get('/api/user/accessibleInventories', {params: {userId: idFromParams}}).then(res=>{
            setAccessibleInventories(res.data)
        })
    }

    useEffect(()=>{
        fillInventories()
        fillAccessibleInventories()
        fillUser()
    }, [idFromParams])
    
    return ( <>
        <h2 className='mb-3'>{user?.email}'s Inventories</h2>
        {currentUser?.id == idFromParams && <div className=' d-flex flex-row gap-3 justify-content-center mb-3'>
            <Button variant='success' onClick={()=>nav('/createInventory')}>Create inventory</Button>
            <Button onClick={logout} variant='danger'>Logout</Button>
        </div>}
        <Tabs defaultActiveKey="inventories" className="mb-3">
            <Tab eventKey="inventories" title="Inventories">
                {userInventories ? <InventoriesTable inventories={userInventories}></InventoriesTable> : <Spinner/>}
                {userInventories?.length == 0 && <h2 className='mt-5'>Uesr doesn't have any inventories</h2>}
            </Tab>
            {currentUser?.id == idFromParams &&
                <Tab eventKey="accessibleInventories" title="Accessible inventories">
                    {accessibleInventories ? <InventoriesTable inventories={accessibleInventories}></InventoriesTable> : <Spinner/>}
                    {accessibleInventories?.length == 0 && <h2 className='mt-5'>User hasn't been given access by anybody</h2>}
                </Tab>
            }
            {currentUser?.role == "ADMIN" && 
                <Tab eventKey="adminPage" title="Admin page">
                    <AdminPage></AdminPage>
                </Tab>
            }
        </Tabs>
    </> );
}

export default User;