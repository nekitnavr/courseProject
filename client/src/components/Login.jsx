import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/esm/Button';
import Alert from 'react-bootstrap/Alert'
import { useState } from 'react';
import { useForm } from "react-hook-form";
import axiosInstance from '../api/axiosConfig';
import {Link, useNavigate} from 'react-router'
import {useAuth} from '../hooks/useAuth'

function Login() {
    const {register, handleSubmit} = useForm()
    const [errorAlertVisible, setErrorAlertVisible] = useState(false)
    const [errorAlertText, setErrorAlertText] = useState()
    const nav = useNavigate()
    const {login} = useAuth()

    const showErrorAlert = (text, time = 3000)=>{
        setErrorAlertText(text)
        setErrorAlertVisible(true)
        setTimeout(()=>setErrorAlertVisible(false), 3000)
    }

    async function onSubmit(data) {
        axiosInstance.post('/api/login', data).then(res=>{
            console.log(res.data);
            login(res.data.user)
            nav('/')
        }).catch(err=>{
            showErrorAlert(err.response.data.message)
        })
    }
    
    return (<>
        <h1>Login</h1>
        <Container id='formContainer' className='text-start'>
            <Form onSubmit={handleSubmit(onSubmit)} className='mb-3'> 
                <Form.Group className='mb-3'>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        {...register('email', {required:true})} 
                        required 
                        className='border border-dark' 
                        type="email" 
                        placeholder="Enter email" 
                    />
                </Form.Group>

                <Form.Group className='mb-3'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        {...register('password', {required:true})} 
                        required 
                        className='border border-dark' 
                        type="password" 
                        placeholder="Enter password" 
                    />
                </Form.Group>
                <Button type='submit' className='mb-3'>Login</Button>
                <p>Don't have an account? <Link to="/signup">Signup</Link></p>
            </Form>
            {errorAlertVisible && <Alert className='alert-danger'>{errorAlertText}</Alert>}
        </Container>
    </> );
}

export default Login;