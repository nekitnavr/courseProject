import Container from "react-bootstrap/esm/Container";
import { Outlet } from "react-router";
import AlertContainer from "./AlertContainer";

function AuthLayout() {
    return ( <>
    <Container 
        className='container-sm min-vh-100 d-flex flex-column justify-content-center' 
        style={{width:'80%', maxWidth: '500px'}}
        data-bs-theme="light"
    >
        <Outlet/>
    </Container>
    </> );
}

export default AuthLayout;