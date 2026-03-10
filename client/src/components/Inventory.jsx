import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import axiosInstance from "../api/axiosConfig";
import ItemsTable from "./ItemsTable";
import { useAuth } from "../hooks/useAuth";
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Badge from "react-bootstrap/esm/Badge";
import FieldsTable from "./FieldsTable";
import AddItemsForm from "./AddItemsForm";
import AddCustomIdForm from "./AddCustomIdForm";
import AddFieldsInventory from "./AddFieldsInventory";
import EditInventorySettingsForm from "./EditInventorySettingsForm";
import InventoryAccess from "./InventoryAccess";
import InventoryDescription from "./InventoryDescription";
import Container from 'react-bootstrap/Container'

function Inventory() {
    const {id} = useParams()
    const {user} = useAuth()
    const [inventory, setInventory] = useState()
    
    const fillInventory = async ()=>{
        axiosInstance.get('/api/inventory', {params: {id: id}}).then(res=>{
            setInventory(res.data)
        })
    }

    const fillItems = async ()=>{
        if (inventory) {
            axiosInstance.get('/api/inventory/items', {params:{inventoryId: inventory.id}}).then(res=>{
                setInventory({...inventory, items:res.data})
            })
        }
    }

    const fillFields = async ()=>{
        if (inventory) {
            axiosInstance.get('/api/inventory/fields', {params:{inventoryId: inventory.id}}).then(res=>{
                setInventory({...inventory, fields:res.data})
            })
        }
    }

    const fillUsersWithAccess = async ()=>{
        if (inventory) {
            axiosInstance.get('/api/inventory/usersWithAccess', {params:{inventoryId: inventory.id}}).then(res=>{
                setInventory({...inventory, usersWithAccess:res.data})
            })
        }
    }
    
    useEffect(()=>{
        fillInventory()
    }, [id])

    useEffect(()=>{
        console.log(inventory);
        updateAccessLevel()
    },[inventory])

    const [accessLevel, setAccesLevel] = useState(0)
    const updateAccessLevel = ()=>{
        if (user?.role == 'ADMIN') {
            setAccesLevel(3)
        } else if (user?.id && user?.id == inventory?.creatorId){
            setAccesLevel(2)
        } else if (inventory?.accessType == 'PUBLIC' || inventory?.usersWithAccess.find(el=>el.id == user?.id)){
            setAccesLevel(1)
        }
    }

    return ( <>
    {inventory && <h2 className="ps-1 mb-3">
        <Link to={`/user/${inventory.creatorId}`}>{inventory.title}</Link>
        {inventory.tags.map((el, i)=>(
            <Badge key={i} className="p-1 ms-2" as={Link} to={`/tag/${el.id}`}>{el.tagName}</Badge>
        ))}
    </h2>}
    <Tabs defaultActiveKey="view" className="mb-3">
        <Tab eventKey="view" title="View items">
            <ItemsTable inventory={inventory} fillItems={fillItems} accessLevel={accessLevel}></ItemsTable>
        </Tab>
        {accessLevel >= 1 && (
            <Tab eventKey="addItems" title="Add items">
                <AddItemsForm inventory={inventory} fillItems={fillItems}></AddItemsForm>
            </Tab>
        )}
        {accessLevel > 1 && (
            <Tab eventKey="fields" title="Fields">
                <FieldsTable fields={inventory?.fields} isView={false} fillFields={fillFields}></FieldsTable>
                <AddFieldsInventory fillFields={fillFields} fields={inventory?.fields} inventoryId={inventory?.id}></AddFieldsInventory>
            </Tab>
        )}
        {accessLevel > 1 && (
            <Tab eventKey="customId" title="Custom ID">
                <AddCustomIdForm 
                    customId={inventory?.customItemId} 
                    inventoryId={inventory?.id}
                ></AddCustomIdForm>
            </Tab>
        )}
        {accessLevel > 1 && (
            <Tab eventKey="settings" title="Settings">
                <EditInventorySettingsForm inventory={inventory} fillInventory={fillInventory}></EditInventorySettingsForm>
            </Tab>
        )}
        {accessLevel > 1 && (
            <Tab eventKey="access" title="Access">
                <InventoryAccess 
                    usersWithAccess={inventory?.usersWithAccess} 
                    fillUsersWithAccess={fillUsersWithAccess}
                    inventoryId={inventory?.id}
                />
            </Tab>
        )}
        <Tab eventKey="description" title="Description">
            <InventoryDescription description={inventory?.description}></InventoryDescription>
        </Tab>
        <Tab eventKey="stats" title="Statistics"></Tab>
    </Tabs>
    </> );
}

export default Inventory;