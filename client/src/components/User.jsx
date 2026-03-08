import { useEffect, useState } from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router'
import axiosInstance from '../api/axiosConfig';
import Spinner from 'react-bootstrap/Spinner'
import InventoriesTable from './InventoriesTable';
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { useAuth } from '../hooks/useAuth';
import AdminPage from './AdminPage';

function User() {
    let {id} = useParams()
    const {user: currentUser} = useAuth()

    const [userInventories, setUserInventories] = useState()
    const [accessibleInventories, setAccessibleInventories] = useState()
    const [user, setUser] = useState()

    const fillUser = async ()=>{
        axiosInstance.get('/api/user', {params: {id: id}}).then(res=>{
            setUser(res.data)
        }).catch(err=>{
            console.log(err);
        })
    }
    const fillInventories = async()=>{
        axiosInstance.get('/api/user/inventories', {params: {userId: id}}).then(res=>{
            setUserInventories(res.data)
        }).catch(err=>{
            console.log(err);
        })
    }
    const fillAccessibleInventories = async()=>{
        axiosInstance.get('/api/user/accessibleInventories', {params: {userId: id}}).then(res=>{
            setAccessibleInventories(res.data)
        }).catch(err=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        fillInventories()
        fillAccessibleInventories()
        fillUser()
    }, [id])
    
    return ( <>
        <h2 className='mb-3'>{user?.email}'s Inventories</h2>
        <Tabs defaultActiveKey="inventories" className="mb-3">
            <Tab eventKey="inventories" title="Inventories">
                {userInventories ? <InventoriesTable inventories={userInventories}></InventoriesTable> : <Spinner/>}
                {userInventories?.length == 0 && <h2 className='mt-5'>Uesr doesn't have any inventories</h2>}
            </Tab>
            {currentUser?.id == id &&
                <Tab eventKey="accessibleInventories" title="Accessible inventories">
                    {accessibleInventories ? <InventoriesTable inventories={accessibleInventories}></InventoriesTable> : <Spinner/>}
                    {accessibleInventories?.length == 0 && <h2 className='mt-5'>User hasn't been given access by anybody</h2>}
                </Tab>
            }
            {currentUser?.role == "ADMIN" && 
                <Tab eventKey="adminPage" title="Adming page">
                    <AdminPage></AdminPage>
                </Tab>
            }
        </Tabs>
    </> );
}

export default User;