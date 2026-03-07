import Table from 'react-bootstrap/esm/Table';

function UsersTable({rowSelect:{toggleSelectAll, selectAll, isSelected, toggleRow}, users, headers, fields}) {
    return ( <>
        <Table>
            <thead>
                <tr>
                    <th><input type="checkbox" name='selectAll' onChange={toggleSelectAll} checked={selectAll}/></th>
                    {headers?.map((el, ind)=>(<th key={ind}>{el}</th>))}
                </tr>
            </thead>
            <tbody>
                {users?.map(user=>(
                    <tr key={user.id}>
                        <td>
                            <input 
                                type="checkbox" 
                                name="checkRow" 
                                onChange={(e)=>{toggleRow(user.id)}} 
                                checked={isSelected(user.id)}
                            />
                        </td>
                        {fields?.map((el, ind)=>(<td key={ind}>{user?.[el].toString()}</td>))}
                    </tr>
                ))}
            </tbody>
        </Table>
    </> );
}

export default UsersTable;