import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/esm/Button';
import Form from 'react-bootstrap/Form'
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/axiosConfig';
import RenderInput from '../lib/RenderInput';
import { mapFieldValues } from '../lib/helpers.js';

function AddItemsForm({inventory, fillItems}) {
    const {register, handleSubmit, reset} = useForm() 

    const onSubmit = (data)=>{
        const fieldValues = mapFieldValues(data.fields)
        // console.log(data);
        // console.log(fieldValues)
        axiosInstance.post('/api/inventory/createItem', {
            fieldValues,
            inventoryId: inventory.id,
            onConflictCustomId: data.customId
        }).then(res=>{
            // console.log(res.data)
            fillItems()
            reset()
            setIsConflict()
        }).catch(err=>{
            console.log(err.response.data)
            if (err.response.data.status == 'P2002') {
                setIsConflict(err.response.data.customId)
            }
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