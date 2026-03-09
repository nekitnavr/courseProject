import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/esm/Button"
import axiosInstance from '../api/axiosConfig'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../hooks/useAuth';
import { useAlert } from '../hooks/useAlert';

function CreateInventoryForm({register, handleSubmit, setValue, formState, setTitleText, setTags, reset}) {
    const {user} = useAuth()
    const [categories, setCategories] = useState([])
    const typeaheadRef = useRef()
    const {showAlert} = useAlert()

    const fillCategories = async ()=>{
        axiosInstance.get('/api/categories').then(res=>{
            setCategories(res.data)
        })
    }

    useEffect(()=>{
        fillCategories()
    },[])

    async function onSubmit(data) {
        console.log(data);
        if(!user) return console.log(`No user so can't create`)
        axiosInstance.post('/api/createInventory', {...data, creatorId: user.id}).then(res=>{
            reset()
            typeaheadRef.current.clear()
            setTitleText('')
            setTags([])
            showAlert(res.data)
        }).catch(err=>{
            showAlert('Error creating inventory', 'danger')
        })
    }

    const handleTagChange = (selected) => {
        let newSelected = new Set(selected.map(el=>el.label ? el.label : el))
        newSelected = [...newSelected]
        setValue('tags', newSelected)
        setTags(newSelected)
    }

    const [isLoading, setIsLoading] = useState(false)
    const [options, setOptions] = useState([])
    const handleSearch = (query)=>{
        setIsLoading(true)
        axiosInstance.get('/api/tags', {params: {tagSearch: query}}).then(res=>{
            setOptions(res.data.map(el=>el.tagName))
            setIsLoading(false)
        })
    }
    
    return ( <>
        <Form onSubmit={handleSubmit(onSubmit)} className='mb-3 text-start' style={{maxWidth:'600px'}}> 
            <Form.Group className='mb-3'>
                <Form.Label className='required'>Title</Form.Label>
                <Form.Control
                    {...register('title', {required:true})} 
                    required 
                    type="text"     
                    placeholder="Enter title"
                    onChange={(e)=>{setTitleText(e.target.value)}}
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>Description</Form.Label>
                <Form.Control 
                    style={{ height: '100px' }}
                    {...register('description', {required:false})} 
                    as="textarea"
                    placeholder="Enter description" 
                />
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label className='required'>Category</Form.Label>
                <Form.Select 
                    {...register('category', {required:true})} 
                    required
                >
                    <option value="">Choose category</option>
                    {categories.map(el=>(
                        <option value={el.id} key={el.id}>{el.categoryName}</option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label className='required'>Access type</Form.Label>
                <Form.Select 
                    {...register('accessType', {required:true})} 
                    required
                >
                    <option value="">Choose access type</option>
                    <option value="PUBLIC">Public</option>
                    <option value="PRIVATE">Private</option>
                </Form.Select>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label>Tags</Form.Label>
                <AsyncTypeahead 
                    className='mb-3' 
                    placeholder="Enter tag name" 
                    {...register('tags', {required:false})}
                    allowNew
                    multiple
                    onChange={handleTagChange}
                    onSearch={handleSearch}
                    options={options}
                    isLoading={isLoading}
                    filterBy={()=>true}
                    ref={typeaheadRef}
                />
            </Form.Group>
            <Button type='submit' className='mb-3'>Create</Button>
        </Form>
    </> );
}

export default CreateInventoryForm;