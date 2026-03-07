import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button';
import { useForm } from 'react-hook-form';
import { maxFieldCount, initialFieldCounter } from '../lib/helpers';
import axiosInstance from '../api/axiosConfig';

function AddFieldsInventory({fillFields, fields, inventoryId}) {
    const {register, handleSubmit, formState, reset} = useForm()
    
    const getFieldCounts = ()=>{
        let newCounter = {...initialFieldCounter}
        fields?.forEach(field => {
            newCounter[field.fieldType.replace('_', '-')]++
        });
        return newCounter
    }
    const [fieldCounter, setFieldCounter] = useState(()=>getFieldCounts())


    useEffect(()=>{
        setFieldCounter(()=>getFieldCounts())
    },[fields])

    useEffect(()=>{
        if (formState.isSubmitSuccessful) {
            reset()
        }
    },[formState])

    const onSubmit = (data)=>{
        // console.log(data)
        const fieldOfTypeNumber = fieldCounter[data.fieldType]+1
        setFieldCounter(prev=>({...prev, [data.fieldType]: fieldOfTypeNumber }))
        axiosInstance.patch('/api/inventory/addField', {
            field: data,
            inventoryId: inventoryId
        }).then(res=>{
            fillFields()
        }).catch(err=>{
            console.log(err)
        })
    }
    
    return ( <>
        <Form className='mb-3 text-start' style={{maxWidth:'600px'}} onSubmit={handleSubmit(onSubmit)}> 
            <Form.Group className='mb-3'>
                <Form.Label className='required'>Field title</Form.Label>
                <Form.Control
                    type="text" 
                    placeholder="Enter title"
                    required
                    {...register('title', {required:true})}
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>Field description</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter description"
                    {...register('description', {required:false})}
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label className='required'>Field type (max 3 fields per type)</Form.Label>
                <Form.Select 
                    required
                    {...register('fieldType', {required:false})}
                >
                    <option value="">Choose field type</option>
                    {fieldCounter['SINGLE-LINE'] < maxFieldCount && <option value="SINGLE-LINE">Single-line text</option>}
                    {fieldCounter['MULTI-LINE'] < maxFieldCount && <option value="MULTI-LINE">Multi-line text</option>}
                    {fieldCounter['NUMERIC'] < maxFieldCount && <option value="NUMERIC">Numeric</option>}
                    {fieldCounter['BOOL'] < maxFieldCount && <option value="BOOL">Boolean</option>}
                </Form.Select>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Check
                    {...register('display', {required:false})}
                    label={'show in inventory'}
                    type="checkbox"
                    id="display-checkbox"
                    defaultChecked
                />
            <Form.Text>Fields are ordered by the creation order</Form.Text>
            </Form.Group>
            <Button type='submit'>Add field</Button>
        </Form>
    </> );
}

export default AddFieldsInventory;