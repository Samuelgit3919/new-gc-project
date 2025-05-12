import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeLayout from './components/HomePage/HomeLayout'
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import AudioBooks from './ui/Audiobooks/AudioBooks'
import Ebook from "./ui/Ebook/Ebook"
import ShopLists from './ui/ShopList/ShopLists'
import ShopListDetail from './ui/ShopList/ShopListsDetail'
import Textbook from "./ui/TextBooks/TextBook"
import AudioBooksDetail from './ui/Audiobooks/AudioBooksDetail'
import EbookDetail from './ui/Ebook/EbookDetail'
import Account from './ui/Account/Account'
import Cart from "./ui/Cart/Cart"
import ProtectedRoutes from './ProtectedRoute'
import VerifyEmail from './components/Auth/VerifyEmail'
import TextBookDetail from './ui/TextBooks/TextBookDetail'
import ForgotPassword from './components/Auth/ForgotPassword'
import ResetPassword from './components/Auth/ResetPassword'
import Page from './admin/Page'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<HomeLayout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgotPassword' element={<ForgotPassword />} />
        <Route path='/resetPassword/:token' element={<ResetPassword />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route element={<ProtectedRoutes />}>
          <Route path='/account' element={<Account />} />
          <Route path='/cart' element={<Cart />} />
        </Route>

        <Route path='/audiobooks' element={<AudioBooks />}
        />
        <Route path='/audiobooks/:id' element={<AudioBooksDetail />} />
        <Route path='/ebook' element={<Ebook />} />
        <Route path='/ebook/:id' element={<EbookDetail />} />
        <Route path='/shopLists' element={<ShopLists />} />
        <Route path='/shopLists/:id' element={<ShopListDetail />} />
        <Route path='/textbooks' element={<Textbook />} />
        <Route path='/textbooks/:id' element={<TextBookDetail />} />
        <Route path='*' element={<div>404 Not Found</div>} />
        <Route path='/page' element={<Page />} />
      </Routes>
    </Router>
  )
}

export default App