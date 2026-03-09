import Table from "react-bootstrap/esm/Table";
import useRowSelect from "../hooks/useRowSelect";
import Button from "react-bootstrap/esm/Button";
import { Trash3, Eye, EyeSlash } from "react-bootstrap-icons";
import {useTheme} from '../hooks/useTheme'
import axiosInstance from "../api/axiosConfig";
import {useAlert} from '../hooks/useAlert'

function FieldsTable({fields, isView, fillFields}) {
    const {toggleSelectAll, toggleRow, selectAll, isSelected, getSelectedRows, deselectAll} = useRowSelect(fields)
    const {theme} = useTheme()
    const buttonVariant = theme == 'dark' ? 'outline-light' : 'outline-dark'
    const {showAlert} = useAlert()

    const handleDelete = ()=>{
        if (getSelectedRows().length > 0){
            axiosInstance.delete('/api/inventory/deleteFields', {
                params: {
                    selectedFields: getSelectedRows(),
                    inventoryId: fields[0].inventoryId
                }
            })
            .then(res=>{
                fillFields()
                deselectAll()
                showAlert(res.data)
            }).catch(err=>{
                showAlert('Error deleting fields', 'danger')
            })
        }
    }
    const handleShow = ()=>{
        if (getSelectedRows().length > 0){
            axiosInstance.patch('/api/inventory/showFields', {
                selectedFields: getSelectedRows()
            }).then(res=>{
                fillFields()
                showAlert(res.data)
            }).catch(err=>{
                showAlert('Error showing fields', 'danger')
            })
        }
    }
    const handleHide = ()=>{
        if (getSelectedRows().length > 0){
            axiosInstance.patch('/api/inventory/hideFields', {
                selectedFields: getSelectedRows()
            }).then(res=>{
                fillFields()
                showAlert(res.data)
            }).catch(err=>{
                showAlert('Error hiding fields', 'danger')
            })
        }
    }
    
    return ( <>
        {!isView && <div className="d-flex gap-2 flex-wrap my-3">
            <Button onClick={handleDelete} variant="danger"><Trash3 size={23} className="pb-1"></Trash3></Button>
            <Button onClick={handleShow} variant={buttonVariant}><Eye size={23} className="pb-1"></Eye></Button>
            <Button onClick={handleHide} variant={buttonVariant}><EyeSlash size={23} className="pb-1"></EyeSlash></Button>
        </div>}
        {fields && <Table className="text-start">
            <thead>
                <tr>
                    {!isView && <th>
                        <input 
                            type="checkbox" 
                            name="checkAll"
                            onChange={toggleSelectAll} 
                            checked={selectAll} />
                    </th>}
                    <th>Field title</th>
                    <th>Field description</th>
                    <th>Field type</th>
                    <th>Order</th>
                    <th>Display</th>
                </tr>
            </thead>
            <tbody>
                {fields.map((field, index)=>(
                    <tr key={index}>
                        {!isView && <td>
                            <input 
                                type="checkbox" 
                                name="checkRow"
                                onChange={(e)=>{toggleRow(field.id)}} 
                                checked={isSelected(field.id)} />
                        </td>}
                        <td>{field.title}</td>
                        <td>{field.description}</td>
                        <td>{field.fieldType}</td>
                        <td>{field.order}</td>
                        <td>{field.display ? 'true' : 'false'}</td>
                    </tr>
                ))}
            </tbody>
        </Table>}
    </> );
}

export default FieldsTable;