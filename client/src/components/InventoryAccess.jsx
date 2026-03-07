import Form from 'react-bootstrap/Form'
import { get, useForm } from 'react-hook-form';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import Button from 'react-bootstrap/esm/Button';
import useRowSelect from '../hooks/useRowSelect';
import { createRef, useEffect, useEffectEvent, useState } from 'react';
import axiosInstance from '../api/axiosConfig';
import { Trash3 } from 'react-bootstrap-icons';
import { useAuth } from '../hooks/useAuth';
import UsersTable from './UsersTable';

function InventoryAccess({usersWithAccess, inventoryId, fillUsersWithAccess}) {
    const {register, handleSubmit, setValue, watch, reset, formState:{isSubmitSuccessful}, setError, clearErrors} = useForm()
    const rowSelect = useRowSelect(usersWithAccess || [])
    const {toggleSelectAll, toggleRow, selectAll, isSelected, getSelectedRows, deselectAll} = rowSelect
    const [isLoading, setIsLoading] = useState(false)
    const [options, setOptions] = useState([])
    const {user} = useAuth()
    const typeaheadRef = createRef()

    const handleSearch = (data)=>{
        setIsLoading(true)
        axiosInstance.get('/api/users', {params: {
            searchString: data,
            userId: user.id
        }}).then(res=>{
            setOptions(res.data)
        }).catch(err=>{
            console.log(err)
        }).finally(()=>{
            setIsLoading(false)
        })
    }

    const handleRemoveAccess = ()=>{
        if (getSelectedRows().length > 0) {
            axiosInstance.patch('/api/inventory/removeAccess', {
                users: getSelectedRows(),
                inventoryId: inventoryId
            }).then(res=>{
                console.log(res.data)
                fillUsersWithAccess()
                deselectAll()
            }).catch(err=>{
                console.log(err.data)
            })
        }
    }

    const handleUserChange = (data)=>{
        clearErrors()
        setValue('user', data?.[0])
    }

    useEffect(() => {
        typeaheadRef.current.clear()
        reset()
    }, [isSubmitSuccessful])

    const onSubmit = async ({user})=>{
        if (user) {
            await axiosInstance.patch('/api/inventory/addAccess', {user: user, inventoryId: inventoryId})
            .then(res=>{
                console.log(res.data)
                fillUsersWithAccess()
            })
            .catch(err=>{
                console.log(err)
            })
        }else{
            setError('No user')
        }
    }
    
    return ( <>
        
        <div style={{maxWidth:'600px'}}>
            <Form className='mb-3 text-start' onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Label>Enter user email or name</Form.Label>
                    <AsyncTypeahead className='mb-3'
                        placeholder="Enter user email" 
                        {...register('user', {required:false})}
                        labelKey="email"
                        onChange={handleUserChange}
                        onSearch={handleSearch}
                        options={options}
                        isLoading={isLoading}
                        filterBy={()=>true}
                        minLength={1}
                        isValid={watch('user')}
                        renderMenuItemChildren={option => (
                            <div>
                                {option.name}
                                <div>
                                    <small>{option.email}</small>
                                </div>
                            </div>
                        )}
                        ref={typeaheadRef}
                    />
                </Form.Group>
                <Button type='submit' className='mb-3'>Add access</Button>
            </Form>
            {usersWithAccess?.length > 0 && <div className="d-flex gap-1 flex-wrap my-3">
                <Button onClick={handleRemoveAccess} variant="danger"><Trash3 size={23} className="pb-1"></Trash3></Button>
            </div>}
            <UsersTable 
                users={usersWithAccess}
                rowSelect={rowSelect}
                headers={['Name', 'Email']}
                fields={['name', 'email']}
            />
        </div>
    </> );
}

export default InventoryAccess;