import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button';
import { useForm } from 'react-hook-form';
import FieldsTable from './FieldsTable';
import { maxFieldCount, initialFieldCounter } from '../lib/helpers';
import { useAlert } from '../hooks/useAlert';

function AddFieldsForm(formMethods) {
    const {register, handleSubmit, formState, reset} = useForm()
    const {showAlert} = useAlert()
    
    const [fieldCounter, setFieldCounter] = useState(initialFieldCounter)
    const [fields, setFields] = useState([])

    const onSubmit = (data)=>{
        const fieldOfTypeNumber = fieldCounter[data.fieldType]+1
        setFieldCounter(prev=>({...prev, [data.fieldType]: fieldOfTypeNumber }))
        setFields([...fields, {...data, 'order':fields.length}])
        const currentFields = formMethods.getValues('fields') || [];
        formMethods.setValue('fields', [...currentFields, {...data, slot: fieldOfTypeNumber}])
    }

    const removeLast = ()=>{
        const fieldType = fields[fields.length-1].fieldType
        const fieldOfTypeNumber = fieldCounter[fieldType]-1
        setFieldCounter(prev=>({...prev, [fieldType]: fieldOfTypeNumber }))
        setFields(prev=>prev.slice(0, -1))
        const currentFields = formMethods.getValues('fields') || [];
        formMethods.setValue('fields', currentFields.slice(0,-1))
    }

    useEffect(()=>{
        if (formState.isSubmitSuccessful) {
            reset()
        }
    },[formState])

    return ( <>
    {fields?.length > 0 && <FieldsTable fields={fields} isView={true}></FieldsTable>}
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
        <div className='d-flex gap-3'>
            <Button type='submit'>Add field</Button>
            {fields?.length > 0 && <Button onClick={removeLast}>Remove last field</Button>}
        </div>
    </Form>
    </> );
}

export default AddFieldsForm;