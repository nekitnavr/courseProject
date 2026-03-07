import Bar from './Bar.jsx'
import { Outlet } from 'react-router';

function MainLayout() {
    return ( <>
        <Bar></Bar>
        <Outlet></Outlet>
    </> );
}

export default MainLayout;