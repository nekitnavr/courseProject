import { useEffect, useState } from "react";
import Spinner from "react-bootstrap/esm/Spinner";
import Table from "react-bootstrap/esm/Table";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { useAuth } from "../hooks/useAuth";
import useRowSelect from "../hooks/useRowSelect";
import {Trash3} from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import axiosInstance from '../api/axiosConfig';
import Modal from 'react-bootstrap/Modal'
import EditItemModal from "./EditItemModal";
import {typeMap} from '../lib/helpers'


function ItemsTable({inventory, fillItems, accessLevel}) {
    const {user} = useAuth()
    
    const renderTooltip = (text) => (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {text ? text : 'No description'}
        </Tooltip>
    );

    const [fieldsToRender, setFieldsToRender] = useState()
    useEffect(()=>{
        setFieldsToRender(inventory?.fields.filter((field)=>field.display == true).map(
            field=>({...field, inDbName: typeMap[field.fieldType]+field.slotNumber})
        ))
    }, [inventory])

    const {toggleSelectAll, toggleRow, selectAll, isSelected, getSelectedRows, deselectAll} = useRowSelect(inventory?.items)

    const deleteSelected = ()=>{
        if (getSelectedRows().length > 0) {
            axiosInstance.delete('/api/inventory/deleteItems', {
                params: {
                    selectedItems: getSelectedRows()
                }
            })
            .then(res=>{
                if(fillItems) fillItems()
                deselectAll()
            })
        }
    }

    const [showModal, setShowModal] = useState(false)
    const [itemForEdit, setItemForEdit] = useState()
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const openEditItemModal = (item)=>{
        if (accessLevel < 1) return
        handleShow()
        setItemForEdit(item)
    }
    
    return ( <>
    {inventory ? 
        <>  
            <EditItemModal 
                showModal={showModal} 
                handleClose={handleClose} 
                fields={inventory?.fields} 
                item={itemForEdit}
                fillItems={fillItems}
            />
            {(accessLevel > 0 && inventory.fields?.length > 0) && 
                <div className="d-flex gap-1 flex-wrap my-3">
                    <Button onClick={deleteSelected} variant="danger"><Trash3 size={23} className="pb-1"></Trash3></Button>
                </div>
            }
            {inventory.fields?.length > 0 ? <Table className="text-start" hover>
                <thead>
                    <tr>
                        {accessLevel > 0 && <th>
                            <div>
                                <input type="checkbox" 
                                    name="checkAll" 
                                    onChange={toggleSelectAll} 
                                    checked={selectAll}
                                />
                            </div>
                        </th>}
                        <th>ID</th>
                        {fieldsToRender?.map((field, ind)=>(
                            <OverlayTrigger
                                key={field.id}
                                placement="bottom"
                                delay={{ show: 400, hide: 400 }}
                                overlay={renderTooltip(field.description)}
                            >
                                <th>{field.title}</th>
                            </OverlayTrigger>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {inventory.items.map((item, index)=>(
                        <tr key={item.id} style={{cursor: accessLevel > 0 ? 'pointer' : 'auto'}} onClick={()=>openEditItemModal(item)}>
                            {accessLevel > 0 && (<td>
                                <input type="checkbox" 
                                    name="checkRow"
                                    onChange={(e)=>{toggleRow(item.id)}} 
                                    checked={isSelected(item.id)}
                                    onClick={(e)=>e.stopPropagation()}
                                />
                            </td>)}
                            <td>{item.customId ? item.customId : item.id}</td>
                            {fieldsToRender?.map((field) => (
                                <td key={field.id}>
                                    {field.fieldType == "BOOL" ? 
                                        (
                                            <input type="checkbox" name="bool" checked={item[field.inDbName]} readOnly/>
                                        ) : 
                                        (
                                            item[field.inDbName]
                                        )
                                    }
                                </td>
                            ))}
                        </tr>
                    ))}
                    
                </tbody>
            </Table> : <h3 className="mt-5">No fields to display in this inventory</h3>}
        </> : <Spinner></Spinner>}
        {inventory?.items.length == 0 && (
            <h3 className="text-center">No items in this inventory</h3>
        )}
    </> );
}

export default ItemsTable;