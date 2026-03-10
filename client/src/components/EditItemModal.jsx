import { useEffect } from "react";
import Modal from 'react-bootstrap/Modal'
import RenderInput from '../lib/RenderInput';
import {useForm} from 'react-hook-form'
import Button from "react-bootstrap/esm/Button";
import Form from 'react-bootstrap/Form'
import { mapFieldValues } from "../lib/helpers";
import axiosInstance from "../api/axiosConfig";
import {useAlert} from '../hooks/useAlert'

function EditItemModal({showModal, handleClose, fields, item, fillItems}) {
    const {register, handleSubmit, reset} = useForm()
    const {showAlert} = useAlert()

    const onSubmit = (data)=> {
        const fieldValues = mapFieldValues(data.fields)

        axiosInstance.patch('/api/inventory/editItem', {
            fieldValues,
            itemId:item.id
        }).then(res=>{
            handleClose()
            fillItems()
            showAlert(res.data)
        }).catch(err=>{
            showAlert('Error updating item', 'danger')
        })
    }

    useEffect(()=>{
        reset()
    }, [item])
    
    return ( <>
        <Modal show={showModal} centered onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit item
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {fields?.map((field, index)=>{
                        return <RenderInput field={field} register={register} key={field.id} item={item}></RenderInput>
                    })}
                    <Button type="submit">Edit item</Button>
                </Form>
            </Modal.Body>
        </Modal>
    </> );
}

export default EditItemModal;