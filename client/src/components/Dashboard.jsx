import '../styles/App.css'
import axiosInstance from '../api/axiosConfig'
import { useEffect, useState } from 'react'
import InventoriesTable from './InventoriesTable'
import Spinner from 'react-bootstrap/Spinner'
import Badge from 'react-bootstrap/esm/Badge'
import { Link } from 'react-router'

function Dashboard() {
  const [popularInventories, setPopularInventories] = useState()
  const [latestInventories, setLatestInventories] = useState()
  const [tagCloud, setTagCloud] = useState()

  const fillPopularInventories = () => {
    axiosInstance.get('/api/popularInventories').then((res) => {
      setPopularInventories(res.data)
    })
  }
  const fillLatestInventories = () => {
    axiosInstance.get('/api/latestInventories').then((res) => {
      setLatestInventories(res.data)
    })
  }
  const fillTagCloud = () => {
    console.log('tag');
    
    axiosInstance.get('/api/tagCloud').then((res) => {
      console.log(res.data);
      
      setTagCloud(res.data)
    })
  }

  useEffect(() => {
    fillPopularInventories()
    fillLatestInventories()
    fillTagCloud()
  }, [])

  return (
    <>
      <div className='d-flex flex-column gap-2'>
        <h2>Most popular inventories</h2>
        {popularInventories ? <InventoriesTable inventories={popularInventories} showCreator={true}/> : <Spinner/>}
        <h2>Latest inventories</h2>
        {latestInventories ? <InventoriesTable inventories={latestInventories} showCreator={true}/> : <Spinner/>}
        <h2>Tag cloud</h2>
        {tagCloud ? 
          (
            <div className='d-flex gap-2 flex-wrap justify-content-center'>
              {tagCloud.map((tag, index)=>(
                  <h4 key={tag.id}>
                    <Badge as={Link} to={`/tag/${tag.id}`}>{tag.tagName}</Badge>
                  </h4>
              ))}
            </div>
          ) : 
          <Spinner/>
        }
      </div>
    </>
  )
}

export default Dashboard
