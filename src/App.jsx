import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Map from './components/map'
import NavScrollExample from './components/layouts/Navbar'
import SidebarExample from './components/layouts/Sidebar'
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavScrollExample />
      <div className='container-fluid mt-3'>
        <div className='row'>
          <div className='col-md-3'>
            <SidebarExample />
          </div>
          <div className='col-md-9'>
            <Map />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
