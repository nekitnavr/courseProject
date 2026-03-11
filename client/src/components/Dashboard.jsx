import '../styles/App.css'
import axiosInstance from '../api/axiosConfig'
import { useEffect, useState } from 'react'
import InventoriesTable from './InventoriesTable'
import Spinner from 'react-bootstrap/Spinner'
import Badge from 'react-bootstrap/esm/Badge'
import { Link, useNavigate } from 'react-router'
import { TagCloud } from 'react-tagcloud'

function Dashboard() {
  const [popularInventories, setPopularInventories] = useState()
  const [latestInventories, setLatestInventories] = useState()
  const [tagCloud, setTagCloud] = useState([])
  const nav = useNavigate()

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
    axiosInstance.get('/api/tagCloud').then((res) => {
      const data = res.data.map(tag=>(
          {key: tag.id, value: tag.tagName, count: tag['_count'].inventories}
        )
      )
      console.log(data);
      
      setTagCloud(data)
    })
  }

  useEffect(() => {
    fillPopularInventories()
    fillLatestInventories()
    fillTagCloud()
  }, [])

  return (
    <>
      <div className='d-flex flex-column gap-3'>
        <div>
          <h2>Most popular inventories</h2>
          {popularInventories ? <InventoriesTable inventories={popularInventories} showCreator={true}/> : <Spinner/>}
        </div>
        <div>
          <h2>Latest inventories</h2>
          {latestInventories ? <InventoriesTable inventories={latestInventories} showCreator={true}/> : <Spinner/>}
        </div>
        <div>
          <h2>Tag cloud</h2>
          {tagCloud ? 
            (
              <TagCloud
                minSize={20}
                maxSize={40}
                tags={tagCloud}
                onClick={tag=>nav(`/tag/${tag.key}`)}
              />
            ) : 
            <Spinner/>
          }
        </div>
      </div>
    </>
  )
}

export default Dashboard
