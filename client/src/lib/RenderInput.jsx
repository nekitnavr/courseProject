import React from 'react'
import Form from 'react-bootstrap/Form'
import { typeMap } from './helpers'

export default function RenderInput({field, register, item}){
    const fieldName = `fields.${field?.id}`
    const inDbName = typeMap[field.fieldType]+field.slotNumber
    const defaultValue = item ? item[inDbName] : null
    
    const renderControl = ()=>{
        switch(field?.fieldType){
            case "SINGLE_LINE": 
                return(
                    <Form.Control 
                        type='text' 
                        placeholder='Enter field value'
                        {...register(fieldName)}
                        defaultValue={defaultValue}
                    />
                )
            case "MULTI_LINE": 
                return(
                    <Form.Control 
                        type='text' 
                        placeholder='Enter field value' 
                        as="textarea"
                        {...register(fieldName)}
                        defaultValue={defaultValue}
                    />
                )
            case "BOOL": 
                return(
                    <Form.Check 
                        placeholder='Enter field value'
                        {...register(fieldName)}
                        defaultChecked={defaultValue ?? true} 
                    />
                )
            case "NUMERIC": 
                return(
                    <Form.Control 
                        type='number' 
                        placeholder='Enter field value'
                        {...register(fieldName)}
                        defaultValue={defaultValue}
                        min={-2147483648}
                        max={2147483647}
                    />
                )
        }}

    return (<>
        <Form.Group key={field.id} className='mb-3'>
            <Form.Label>{field.title}</Form.Label>
            {renderControl()}
        </Form.Group>
    </>)        
}