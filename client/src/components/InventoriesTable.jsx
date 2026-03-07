import Table from 'react-bootstrap/Table'
import Badge from 'react-bootstrap/esm/Badge';
import { useNavigate } from 'react-router';

function InventoriesTable({inventories}) {
    let nav = useNavigate()

    return ( <>
        {inventories?.length > 0 && <Table className='text-start' hover>
            <thead>
                <tr>
                    <th>Inventory title</th>
                    <th>Tags</th>
                    <th>Category</th>
                    <th>Access type</th>
                </tr>
            </thead>
            <tbody>
                {inventories?.map((inventory, ind)=>(
                    <tr key={inventory.id} style={{cursor:'pointer'}} onClick={()=>nav(`/inventory/${inventory.id}`)}>
                        <td>{inventory.title}</td>
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