import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/esm/Button"
import axiosInstance from '../api/axiosConfig'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useAlert } from '../hooks/useAlert';
import Markdown from 'react-markdown';

function EditInventorySettingsForm({inventory, fillInventory}) {
    const {handleSubmit, register, setValue, reset, watch} = useForm()
    const [categories, setCategories] = useState([])
    const {showAlert} = useAlert()
    const [selectedTags, setSelectedTags] = useState([])

    const fillCategories = async ()=>{
        axiosInstance.get('/api/categories').then(res=>{
            setCategories(res.data)
        })
    }

    const handleTagChange = (selected) => {
        let newSelected = new Set(selected.map(el=>el.label ? el.label : el))
        newSelected = [...newSelected]
        console.log(newSelected);
        setSelectedTags(newSelected)
        setValue('tags', newSelected)
    }

    useEffect(()=>{
        fillCategories()
    },[])

    useEffect(()=>{
        const initialTags = inventory?.tags.map(el=>el.tagName) || []
        setSelectedTags(initialTags)
        reset({
            title: inventory?.title || '',
            description: inventory?.description || '',
            category: inventory?.categoryId || '',
            accessType: inventory?.accessType || '',
            tags: initialTags
        });
    }, [inventory])

    const onSubmit = (data)=>{
        console.log(data);
        axiosInstance.patch('/api/inventory/settings',{
            settings: data,
            inventoryId: inventory.id
        }).then(res=>{
            fillInventory()
            showAlert(res.data)
        }).catch(err=>{
            showAlert('Error updating inventory settings', 'danger')
        })
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
                <Markdown>{watch('description')}</Markdown>
            </Form.Group>
            <Form.Group className='mb-3'>
                <Form.Label className='required'>Category</Form.Label>
                <Form.Select 
                    {...register('category', {required:true})} 
                    required
                >
                    <option>Choose category</option>
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
                <AsyncTypeahead className='mb-3' 
                    placeholder="Enter tag name" 
                    allowNew
                    multiple
                    onChange={handleTagChange}
                    onSearch={handleSearch}
                    options={options}
                    isLoading={isLoading}
                    filterBy={()=>true}
                    selected={selectedTags}
                />
            </Form.Group>
            <Button type='submit' className='mb-3' variant='success'>Update settings</Button>
        </Form>
    </> );
}

export default EditInventorySettingsForm;