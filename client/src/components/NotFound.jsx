import { Link } from "react-router";

function NotFound() {
    return ( <>
        <h1 className="mb-3">Page not found</h1>
        <h2><Link to={'/'}>Main page</Link></h2>
    </> );
}

export default NotFound;