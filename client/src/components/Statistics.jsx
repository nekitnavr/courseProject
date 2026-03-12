import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import Button from "react-bootstrap/esm/Button";
import { useAlert } from "../hooks/useAlert";
import Spinner from "react-bootstrap/esm/Spinner";

function Statistics({inventoryId}) {
    const {showAlert} = useAlert()
    const [stats, setStats] = useState()
    const fillStats = ()=>{
        axiosInstance.get('/api/inventory/statistics', {params: {inventoryId: inventoryId}}).then(res=>{
            setStats(res.data)
        }).catch(()=>{
            showAlert('Error fetching statistics', 'danger')
        })
    }

    useEffect(()=>{
        fillStats()
    },[])

    const handleRefresh = ()=>{
        setStats(null)
        fillStats()
        showAlert('Refreshed')
    }

    const renderStats = (el)=>{
        let stat
        switch (el.field.fieldType) {
            case "NUMERIC":
                stat = <>
                    <p>Min: {el.value['_min']}</p>
                    <p>Max: {el.value['_max']}</p>
                    <p>Avg: {el.value['_avg'].toFixed(2)}</p>
                </>
                break;
        
            default:
                return null
        }
        return (
            <div key={el.field.id} className="text-start">
                <h3>{el.field.title}</h3>
                {stat}
                <br />
            </div>
        )
    }
    
    return ( <>
        <div className="d-flex flex-column align-items-start">
            <div className="mb-3">
                <Button onClick={handleRefresh}>Refresh</Button>
            </div>
            {stats ? <>
                <h3>Item count: {stats?.itemCount}</h3>
                {stats?.fields.map(el=>renderStats(el))}
            </> : <Spinner/>}
        </div>
    </> );
}

export default Statistics;