import '../styles/App.css'
import axiosInstance from '../api/axiosConfig'
import { useEffect, useState } from 'react'
import InventoriesTable from './InventoriesTable'
import Spinner from 'react-bootstrap/Spinner'

function Dashboard() {
  const [popularInventories, setPopularInventories] = useState()
  const [latestInventories, setLatestInventories] = useState()

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

  useEffect(() => {
    fillPopularInventories()
    fillLatestInventories()
  }, [])

  return (
    <>
      <h2>Most popular inventories</h2>
      {popularInventories ? <InventoriesTable inventories={popularInventories} showCreator={true}/> : <Spinner/>}
      <h2>Latest inventories</h2>
      {latestInventories ? <InventoriesTable inventories={latestInventories} showCreator={true}/> : <Spinner/>}
      <h2>Tag cloud</h2>
    </>
  )
}

export default Dashboard
