import '../styles/App.css'
import axiosInstance from '../api/axiosConfig'
import { useEffect, useState } from 'react'
import InventoriesTable from './InventoriesTable'
import Spinner from 'react-bootstrap/Spinner'

function Dashboard() {
  const [popularInventories, setPopularInventories] = useState()

  const fillPopularInventories = ()=>{
    axiosInstance.get('/api/popularInventories').then((res)=>{
      setPopularInventories(res.data)
    })
  }

  useEffect(()=>{
    fillPopularInventories()
  }, [])
  
  return (
    <>
      <h2>Most popular inventories</h2>
      {popularInventories ? <InventoriesTable inventories={popularInventories}></InventoriesTable> : <Spinner></Spinner>}
    </>
  )
}

export default Dashboard
