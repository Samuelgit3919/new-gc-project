import React, { useContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomeLayout from './components/HomePage/HomeLayout'
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import AudioBooks from './ui/Audiobooks/AudioBooks'
import Ebook from "./ui/Ebook/Ebook"
import ShopLists from './ui/ShopList/ShopLists'
import ShopListDetail from './ui/ShopList/ShopListDetail'
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
import FAQPage from './ui/Help/FAQPage'
import ContactPage from './ui/Help/ContactPage'
import TermsOfUse from './ui/Help/TermsOfUse'
import { Type } from './Utility/action.type'
import { DataContext } from './DataProvider/DataProvider'
import AdminPanel from './systemAdmin/AdminPage'



const App = () => {
  const [{ user }, dispatch] = useContext(DataContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    // const userId = localStorage.getItem("userId");
    const userId = user ? JSON.parse(user)._id : null; // Extract userId from user object
    console.log(userId);
    if (user) {
      dispatch({
        type: Type.SET_USER,
        user: JSON.parse(user),
      });
    }
    // if (userId) {
    //   dispatch({
    //     type: Type.SET_USER_ID,
    //     userId: JSON.parse(userId),
    //   });
    // }
    // console.log("User:", user);
    // console.log("User ID:", userId);
    // console.log("Token:", token);
    if (token) {

      console.log("Token found:", token);
    } else {
      console.log("No token found");
    }
  }
    , []);
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
          <Route path='/page' element={<Page />} />
        </Route>

        <Route path='/adminPanel' element={<AdminPanel />} />

        <Route path='/audiobooks' element={<AudioBooks />}
        />
        <Route path='/audiobooks/:id' element={<AudioBooksDetail />} />
        <Route path='/ebook' element={<Ebook />} />
        <Route path='/ebook/:id' element={<EbookDetail />} />
        <Route path='/shopLists' element={<ShopLists />} />
        <Route path='/shopLists/:id' element={<ShopListDetail />} />
        <Route path='/textbooks' element={<Textbook />} />
        <Route path='/textbooks/:id' element={<TextBookDetail />} />
        <Route path='/FaqPage' element={< FAQPage />} />
        <Route path='/contactPage' element={<ContactPage />} />
        <Route path='/termsOfUse' element={<TermsOfUse />} />
        <Route path='*' element={<div>404 Not Found</div>} />

      </Routes>
    </Router>
  )
}

export default App