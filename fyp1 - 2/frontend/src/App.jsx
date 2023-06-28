import React from 'react'
//import 'bootstrap-icons/font/bootstrap-icons.css';
import Login from './Login'
import SignUp from './SignUp'
import CreateProfile from './CreateProfile'
import UserProfile from './UserProfile'
import UploadFile  from './UploadFile'
import Encounters from './Encounters'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import EditProfile from './EditProfile'
import Dmin from './Dmin';
import Chat from './Chat';
import UserPayment from './UserPayment'
import BlockList from './BlockList'
import Users from './Users'
import EditPicture from './EditPicture'

 function App(){
  return(
    <BrowserRouter>
      <Routes>
      <Route path='/BlockList' element={<BlockList/>}></Route>
      <Route path='/EditPicture' element={<EditPicture/>}></Route>

        <Route path='/' element={<Login/>}></Route>
        <Route path='/Users' element={<Users/>}></Route>
        <Route path='/Chat' element={<Chat/>}></Route>
        <Route path='/CreateProfile'element={<CreateProfile />}></Route>
        <Route path='/SignUp' element={<SignUp />}></Route>
        <Route path='/UserProfile' element={<UserProfile />}></Route>
        <Route path='/Login' element={<Login />}></Route>
        <Route path='/UploadFile' element={<UploadFile />}></Route>
        <Route path='/Encounters' element={<Encounters />}></Route>
        <Route path='/EditProfile' element={<EditProfile />}></Route>
        <Route path="/Dmin" element={<Dmin />} />
        <Route path="/UserPayment" element={<UserPayment/>}></Route>

      </Routes>
    </BrowserRouter>
  )
 }
 export default App
