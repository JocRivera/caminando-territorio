import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Map from './components/map'
import NavScrollExample from './components/layouts/Navbar'
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavScrollExample />
      <div className='container-fluid mt-3'>
        <Map />
      </div>
    </>
  )
}

export default App
