import AlertContainer from './AlertContainer.jsx';
import Bar from './Bar.jsx'
import { Outlet } from 'react-router';

function MainLayout() {
    return ( <>
        <AlertContainer></AlertContainer>
        <Bar></Bar>
        <Outlet></Outlet>
    </> );
}

export default MainLayout;