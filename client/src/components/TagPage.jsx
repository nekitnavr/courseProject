import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import Badge from "react-bootstrap/esm/Badge";
import { useParams } from "react-router";
import InventoriesTable from "./InventoriesTable";
import { useAlert } from "../hooks/useAlert";

function TagPage() {
    const {id} = useParams()
    const [tag, setTag] = useState()
    const {showAlert} = useAlert()

    useEffect(()=>{
        fillTag()
    }, [])
    console.log(tag);
    
    const fillTag = ()=>{
        axiosInstance.get('/api/tag', {params: {tagId: id}}).then(res=>{
            setTag(res.data)
        }).catch(err=>{
            if (err.response.data.status == 404) return showAlert('Tag not found', 'danger')
            showAlert('Tag not found', 'danger')
        })
    }
    
    return ( <>
        <h1>
            <Badge>{tag?.tagName}</Badge>
        </h1>
        <InventoriesTable inventories={tag?.inventories}></InventoriesTable>
    </> );
}

export default TagPage;