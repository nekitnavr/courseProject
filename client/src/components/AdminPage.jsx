import { useEffect, useEffectEvent, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import useRowSelect from "../hooks/useRowSelect";
import UsersTable from "./UsersTable";
import Button from "react-bootstrap/esm/Button";
import { Lock, Unlock, Trash3 } from "react-bootstrap-icons";
import FormSelect from "react-bootstrap/esm/FormSelect";

function AdminPage() {
    const [users, setUsers] = useState([])
    const [sortedUsers, setSortedUsers] = useState([])
    const [sortValue, setSortValue] = useState('')
    const rowSelect = useRowSelect(users || [])
    const {getSelectedRows} = rowSelect

    useEffect(()=>{
        fillUsers()
    },[])

    useEffect(()=>{
        sortUsers()
    }, [users, sortValue])

    const sortUsers = ()=>{
        switch(sortValue){
            case 'name':
                setSortedUsers([...users].sort((a,b)=>a.name.localeCompare(b.name)))
                break
            case 'email':
                setSortedUsers([...users].sort((a,b)=>a.email.localeCompare(b.email)))
                break
            default:
                setSortedUsers([...users])
        }
    }
    
    const fillUsers = ()=>{
        axiosInstance.get('/api/allUsers').then(res=>{
            setUsers(res.data)
        })
    }

    const handleDelete = ()=>{
        if (getSelectedRows().length > 0) {
            axiosInstance.patch('/api/users/delete', {userIds: getSelectedRows()})
            .then(res=>fillUsers())
        }
    }

    const handleBlock = ()=>{
        if (getSelectedRows().length > 0) {
            axiosInstance.patch('/api/users/block', {userIds: getSelectedRows()})
            .then(res=>fillUsers())
        }
    }
    const handleUnblock = ()=>{
        if (getSelectedRows().length > 0) {
            axiosInstance.patch('/api/users/unblock', {userIds: getSelectedRows()})
            .then(res=>fillUsers())
        }
    }
    const handleAdmin = ()=>{
        if (getSelectedRows().length > 0) {
            axiosInstance.patch('/api/users/makeAdmin', {userIds: getSelectedRows()})
            .then(res=>fillUsers())
        }
    }
    const handleUser = ()=>{
        if (getSelectedRows().length > 0) {
            axiosInstance.patch('/api/users/makeUser', {userIds: getSelectedRows()})
            .then(res=>fillUsers())
        }
    }
    
    const handleSelect = (e)=>{setSortValue(e.target.value)}

    return ( <>
        {users?.length > 0 && 
            <div className="d-flex gap-1 flex-wrap my-3">
                <Button onClick={handleDelete} variant="danger"><Trash3 size={23} className="pb-1"></Trash3></Button>
                <Button onClick={handleBlock}><Lock size={22} className="pb-1"></Lock></Button>
                <Button onClick={handleUnblock}><Unlock size={23} className="pb-1"></Unlock></Button>
                <Button onClick={handleAdmin}>Make ADMIN</Button>
                <Button onClick={handleUser}>Make USER</Button>
                <FormSelect style={{maxWidth: '200px'}} onChange={handleSelect} value={sortValue}>
                    <option value="">Sort by</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                </FormSelect>
            </div>
        }
        <UsersTable 
            users={sortedUsers}
            rowSelect={rowSelect}
            headers={['Name', 'Email', 'Role', 'Blocked']}
            fields={['name', 'email', 'role', 'blocked']}
        />
    </> );
}

export default AdminPage;