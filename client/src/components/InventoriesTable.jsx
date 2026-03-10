import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/esm/Badge';
import { useNavigate } from 'react-router';
import useRowSelect from '../hooks/useRowSelect';
import { Trash3 } from 'react-bootstrap-icons';
import Button from 'react-bootstrap/esm/Button';
import axiosInstance from '../api/axiosConfig';
import { useAlert } from '../hooks/useAlert';

function InventoriesTable({inventories, editable, fillInventories, showCreator}) {
    const {toggleSelectAll, toggleRow, selectAll, isSelected, getSelectedRows, deselectAll} = useRowSelect(inventories || [])
    const {showAlert} = useAlert()
    let nav = useNavigate()

    const deleteSelected = ()=>{
        if (getSelectedRows().length > 0) {
            axiosInstance.delete('/api/inventories', {
                params: {
                    selectedInventories: getSelectedRows()
                }
            }).then(res=>{
                fillInventories()
                showAlert(res.data)
            }).catch(err=>{
                showAlert('Error deleting inventories', 'danger')
            })
        }
    }

    return ( <>
        {(editable && inventories?.length > 0) && 
            <div className="d-flex gap-1 flex-wrap my-3">
                <Button onClick={deleteSelected} variant="danger"><Trash3 size={23} className="pb-1"></Trash3></Button>
            </div>
        }
        {inventories?.length > 0 && <Table className='text-start' hover responsive>
            <thead>
                <tr>
                    {editable && <th>
                            <input 
                                type="checkbox" 
                                name="checkAll" 
                                onChange={toggleSelectAll} 
                                checked={selectAll}
                            />
                        </th>
                    }
                    <th>Inventory title</th>
                    {showCreator && <th>Creator</th>}
                    <th>Tags</th>
                    <th>Category</th>
                    <th>Access type</th>
                </tr>
            </thead>
            <tbody>
                {inventories?.map((inventory, ind)=>(
                    <tr key={inventory.id} style={{cursor:'pointer'}} onClick={()=>nav(`/inventory/${inventory.id}`)}>
                        {editable && 
                            <td>
                                <input 
                                    type="checkbox" 
                                    name="checkRow"
                                    onChange={(e)=>{toggleRow(inventory.id)}} 
                                    checked={isSelected(inventory.id)}
                                    onClick={(e)=>e.stopPropagation()}
                                />
                            </td>
                        }
                        <td>{inventory.title}</td>
                        {showCreator && <td>{inventory?.creator?.name}</td>}
                        <td>
                            {inventory.tags?.map((el, i)=>(
                                <Badge key={i} className="me-2" style={{fontSize: '0.9rem'}}>{el.tagName}</Badge>
                            ))}
                        </td>
                        <td>{inventory.category?.categoryName}</td>
                        <td>{inventory.accessType}</td>
                    </tr>
                ))}
            </tbody>
        </Table>}
    </> );
}

export default InventoriesTable;