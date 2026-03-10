import AlertContainer from './AlertContainer.jsx';
import Bar from './Bar.jsx'
import { Outlet } from 'react-router';
import InventorySearch from './InventorySearch.jsx';

function MainLayout() {
    return ( <>
        <AlertContainer></AlertContainer>
        <InventorySearch></InventorySearch>
        <Bar></Bar>
        <Outlet></Outlet>
    </> );
}

export default MainLayout;