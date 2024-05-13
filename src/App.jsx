import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Paginas/Home'
import Navbar from './Componentes/Navbar'
import AgregarActualizar from './Paginas/AgregarActualizar'


function App() {
 

  return (
    <>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Agregar' element={<AgregarActualizar/>}/>
        <Route path='/Actualizar/:id' element={<AgregarActualizar/>}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
