import Form from 'react-bootstrap/Form'
import { useFieldArray, useForm } from 'react-hook-form';
import Button from 'react-bootstrap/esm/Button';
import random from 'random'
import { useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const exampleID = (idElements, separator = '') => {
    return idElements.map(el => {
        switch (el.idElementType) {
            case 'TEXT':
                return el.fixedText
            case 'RANDOM_20_BIT':
                return random.int(0, 1048575)
            case 'RANDOM_32_BIT':
                return random.int(0, 4294967295)
            case 'RANDOM_6_DIGIT':
                return random.int(100000, 999999)
            case 'RANDOM_9_DIGIT':
                return random.int(100000000, 999999999)
            case 'GUID':
                return crypto.randomUUID()
            case 'DATE':
                return new Date().toISOString()
            case 'SEQUENCE':
                return 0
            default:
                return ''
        }
    }).filter(el => el !== '').join(separator);
}

function AddCustomIdForm({setValue: setOuterFormValue, customId, inventoryId}) {
    const { control, register, watch, reset, setValue, handleSubmit } = useForm({
        defaultValues: {
            idElements: customId?.idElements || [],
            separator: customId?.separator || ''
        }
    })
    const { fields, append, remove } = useFieldArray({ control, name: 'idElements' })

    const idElements = watch('idElements')
    const form = watch()

    useEffect(() => {
        if(setOuterFormValue) setOuterFormValue('customItemId', form)
    }, [form])

    const addElement = () => {
        if (idElements[0] && idElements[idElements.length - 1].idElementType == '') {
            return
        } else {
            append({ idElementType: '' })
        }
    }

    const onSubmit = async (data)=>{
        // console.log(data);
        axiosInstance.patch('/api/inventory/updateCustomId', {
            configId: customId?.id,
            idElements: data.idElements,
            separator: data.separator,
            inventoryId: inventoryId
        }).then(res=>{
            console.log(res.data)
        }).catch(err=>{
            console.log(err)
        })
    }

    return (<>
        {idElements[0] && <>
            <h3 className='text-start mb-3'>Example: {exampleID(idElements, form.separator)}</h3>
        </>}
        <Form className='mb-3 text-start' style={{ maxWidth: '600px' }} onSubmit={handleSubmit(onSubmit)}>
            {idElements[1] && <Form.Group className='mb-3'>
                <Form.Label>Separator</Form.Label>
                <Form.Control
                    placeholder='Enter separator'
                    {...register(`separator`)}
                />
            </Form.Group>}
            {fields.map((field, index) => (
                <Form.Group className='mb-3 d-flex gap-3' key={field.id}>
                    <Form.Select
                        {...register(`idElements.${index}.idElementType`, {required: true})}
                    >
                        <option value="">Choose field type</option>
                        <option value="TEXT">Text</option>
                        <option value="RANDOM_20_BIT">20 bit random number</option>
                        <option value="RANDOM_32_BIT">32 bit random number</option>
                        <option value="RANDOM_6_DIGIT">6 digit random number</option>
                        <option value="RANDOM_9_DIGIT">9 digit random number</option>
                        <option value="GUID">GUID</option>
                        <option value="DATE">Date and time at creation moment</option>
                        <option value="SEQUENCE">Sequence</option>
                    </Form.Select>
                    {watch(`idElements.${index}.idElementType`) == 'TEXT' &&
                        <Form.Control
                            placeholder='Set text value'
                            {...register(`idElements.${index}.fixedText`)}
                        />
                    }
                </Form.Group>
            ))}
            <div className='d-flex gap-3'>
                <Button onClick={() => addElement()}>Add id element</Button>
                {idElements[0] && <Button onClick={() => reset({ idElements: [] })}>Clear</Button>}
                {idElements[0] && <Button onClick={() => remove(idElements.length - 1)}>Remove last element</Button>}
                {!setOuterFormValue && <Button variant='success' type='submit'>Update custom id</Button>}
            </div>
        </Form>
    </>);
}

export default AddCustomIdForm;