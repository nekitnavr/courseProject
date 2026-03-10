import '../styles/required.css'
import { useForm } from "react-hook-form"
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import { useState } from "react"
import Badge from 'react-bootstrap/Badge'
import AddFieldsForm from './AddFieldsForm'
import AddCustomIdForm from './AddCustomIdForm'
import CreateInventoryForm from './CreateInventoryForm'

function CreateInventory() {
    const methods = useForm({defaultValues:{tags:[]}})
    const [titleText, setTitleText] = useState()
    const [tags, setTags] = useState([])
    
    return ( <>
    <h2>Inventory creation</h2>
    {titleText && 
        <h2 className="text-start ps-1 mb-2">{titleText} {tags.map((el, i)=>(<Badge key={i} className="p-1 me-2">{el}</Badge>))}</h2>}
    <Tabs defaultActiveKey="main" className="mb-3">
        <Tab eventKey="main" title="Main">
            <CreateInventoryForm {...methods} setTitleText={setTitleText} setTags={setTags}></CreateInventoryForm>
        </Tab>
        <Tab eventKey="fields" title="Fields">
            <AddFieldsForm {...methods}></AddFieldsForm>
        </Tab>
        <Tab eventKey="customId" title="Custom ID">
            <AddCustomIdForm {...methods}></AddCustomIdForm>
        </Tab>
    </Tabs>
    </> );
}

export default CreateInventory;