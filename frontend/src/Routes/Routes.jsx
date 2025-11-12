import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../Contexts/AuthContext';
import PrivateRoute from './PrivateRoute';
import { Home } from '../Pages/Home';
import Login from '../Pages/Login';
import SignUp from '../Pages/SignUp';
import Wishlist from '../Pages/Wishlist';
import Cart from '../Pages/Cart';
import Checkout from '../Pages/Checkout';

function Routes(){
     return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <PrivateRoute>
                <Wishlist />
              </PrivateRoute>
            }
          />
          <Route
            path="/checkout"
            element={
                <PrivateRoute>
                    <Checkout />
                </PrivateRoute>
            }
           />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default Routes