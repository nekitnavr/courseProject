import 'bootstrap/dist/css/bootstrap.min.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Dashboard from './components/Dashboard.jsx'
import { BrowserRouter, Routes, Route } from 'react-router'
import Login from "../src/components/Login.jsx";
import Signup from "../src/components/Signup.jsx";
import AuthLayout from './components/AuthLayout.jsx'
import User from './components/User.jsx'
import CreateInventory from './components/CreateInventory.jsx'
import MainLayout from './components/MainLayout.jsx'
import { ThemeProvider } from './components/ThemeProvider.jsx'
import AuthProvider from './components/AuthProvider.jsx'
import Inventory from './components/Inventory.jsx'
import AlertProvider from './components/AlertProvider.jsx'
import TagPage from './components/TagPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AlertProvider>
          <AuthProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route index element={<Dashboard />}/>
                <Route path='/user/:id' element={<User />} />
                <Route path='/inventory/:id' element={<Inventory />} />
                <Route path='/createInventory' element={<CreateInventory />} />
                <Route path='/tag/:id' element={<TagPage/>}></Route>
              </Route>

              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

            </Routes>
          </AuthProvider>
        </AlertProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
