import { Link, OpticalAudio, Search } from 'react-bootstrap-icons';
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import axiosInstance from '../api/axiosConfig';
import { useRef, useState } from 'react';
import Nav from 'react-bootstrap/Nav'
import { useNavigate } from 'react-router';

function InventorySearch() {
    const [isLoading, setIsLoading] = useState()
    const [options, setOptions] = useState()
    const nav = useNavigate()
    const searchRef = useRef()

    const handleChange = (selected)=>{
        if (selected) {
            const option = selected[0]
            nav(`/inventory/${option.id}`)
            searchRef.current.clear()
        }
    }
    const handleSearch = (search)=>{
        setIsLoading(true)
        axiosInstance.get('/api/inventories', {params: {searchString: search}})
            .then(res=>setOptions(res.data))
            .finally(()=>setIsLoading(false))
    }

    const renderMenuItemChildren = (option)=>(
        <div className='mb-1'>
            <h5 className='mb-0'>{option.title}</h5>
            {option.description && 
                <div>
                    <small><p className='text-wrap mb-1'>{option.description + '...'}</p></small>
                </div>
            }
        </div>
    )
    
    return ( <>
        <div className='mb-3' style={{maxWidth: '450px'}}>
            <AsyncTypeahead
                placeholder={`Type to search for inventories 🔍`}
                onChange={handleChange}
                labelKey={option=>option.title}
                onSearch={handleSearch}
                renderMenuItemChildren={renderMenuItemChildren}
                minLength={1}
                isLoading={isLoading}
                filterBy={()=>true}
                options={options}
                searchText={'Searching'}
                ref={searchRef}
            />
        </div>
    </> );
}

export default InventorySearch;