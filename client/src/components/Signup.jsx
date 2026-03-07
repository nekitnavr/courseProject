// import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button';
import Alert from 'react-bootstrap/Alert'
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import axiosInstance from '../api/axiosConfig';
import {Link, useNavigate} from 'react-router'

function Signup() {
    const {register, handleSubmit, reset, watch, formState:{errors}} = useForm()
    const [successAlertVisible, setSuccessAlertVisible] = useState(false)
    const [errorAlertVisible, setErrorAlertVisible] = useState(false)
    const [errorAlertText, setErrorAlertText] = useState()
    const nav = useNavigate('/dashboard')

    useEffect(()=>{
        // if (localStorage.getItem('loggedInAs')) {
        //     nav('/dashboard')
        // }
    },[])

    const showSuccessAlert = (time = 3000)=>{
        setSuccessAlertVisible(true)
        setTimeout(()=>setSuccessAlertVisible(false), time)
    }
    const showErrorAlert = (text, time = 3000)=>{
        setErrorAlertText(text)
        setErrorAlertVisible(true)
        setTimeout(()=>setErrorAlertVisible(false), 3000)
    }

    function onSubmit(data) {
        // console.log(data);
        axiosInstance.post('/api/signup', data).then(res=>{
            console.log(res.data);
            showSuccessAlert()
        }).catch(err=>{
            console.log(err.response);
            showErrorAlert(err.response.data)
        })
    }
    
    return ( <>
        <h1>Sign up</h1>
        <Container id='formContainer' className='text-start'>
            <Form onSubmit={handleSubmit(onSubmit)} className='mb-3'> 
                <Form.Group className='mb-3'>
                    <Form.Label className='required'>Email address</Form.Label>
                    <Form.Control 
                        {...register('email', {required:true})} 
                        required 
                        className='border border-dark' 
                        type="email" 
                        placeholder="Enter email"
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label className='required'>Name</Form.Label>
                    <Form.Control 
                        {...register('name', {required:true})} 
                        required 
                        className='border border-dark' 
                        type="text" 
                        placeholder="Enter your name"
                    />
                </Form.Group>
                <Form.Group className='mb-3'>
                    <Form.Label className='required'>Password</Form.Label>
                    <Form.Control 
                        {...register('password', {required:true})} 
                        required 
                        className='border border-dark' 
                        type="password" 
                        placeholder="Enter password"
                    />
                </Form.Group>
                <Button type='submit' className='mb-3'>Signup</Button>
                <p>Have an account already? <Link to="/login">Login</Link></p>
            </Form>
            {successAlertVisible && <Alert className='alert-success'>User created successfully</Alert>}
            {errorAlertVisible && <Alert className='alert-danger'>{errorAlertText}</Alert>}
        </Container>
    </> );
}

export default Signup;