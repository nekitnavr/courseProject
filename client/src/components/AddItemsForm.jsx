import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form'
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/axiosConfig';
import RenderInput from '../lib/RenderInput';
import { mapFieldValues } from '../lib/helpers.js';
import {useAlert} from '../hooks/useAlert.jsx'

function AddItemsForm({inventory, fillItems}) {
    const {register, handleSubmit, reset} = useForm() 
    const {showAlert} = useAlert()

    const onSubmit = (data)=>{
        const fieldValues = mapFieldValues(data.fields)
        axiosInstance.post('/api/inventory/createItem', {
            fieldValues,
            inventoryId: inventory.id,
            onConflictCustomId: data.customId
        })
        .then(res=>{
            fillItems()
            reset()
            setIsConflict()
            showAlert(res.data, 'success', 1500)
        }).catch(err=>{
            if (err.response.data.status == 'P2002') {
                setIsConflict(err.response.data.customId)
                return showAlert('Conflict occured', 'danger', 2000)
            }
            showAlert('Error adding a new item', 'danger', 2000)
        })
    }

    const [isConfilct, setIsConflict] = useState()
    
    return ( <>
        {inventory?.fields?.length > 0 ? <Form className='mb-3 text-start' style={{maxWidth:'600px'}} onSubmit={handleSubmit(onSubmit)}>
            {isConfilct && (
                <Form.Group>
                    <Form.Label>CustomId</Form.Label>
                    <Form.Control
                        type='text'
                        {...register('customId')}
                        placeholder='Enter customId'
                        className='mb-3'
                        defaultValue={isConfilct}
                    />
                </Form.Group>
            )}
            {inventory.fields.map((field, index)=>(
                <RenderInput field={field} register={register} key={field.id}></RenderInput>
            ))}
            <Button type='submit'>Create item</Button>
        </Form> : <h2>No fields</h2>}
    </> );
}

export default AddItemsForm;