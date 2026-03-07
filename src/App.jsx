import { Routes, Route ,useLocation} from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { getMe } from "./services/authServices";
import useAuthStore from "./store/authStore";
import { useEffect } from "react";


 import Home from "./pages/public/homePage";
 import BrowseProviders from "./pages/public/browseProviderPage";
 import ProviderProfile from "./pages/public/providerProfilepage";
import Login from "./pages/public/loginPage";
import Register from "./pages/public/registerPage";
import Navbar from "./components/common/Navbar";
import ComingSoon from "./pages/public/comingSoon";


 import CustomerDashboard from "./pages/customer/customerDashboard";
 import MyBookings from "./pages/customer/myBookings";
 import BookingDetail from "./pages/customer/bookingDetail";
import BookingForm from "./pages/customer/bookingForm";


 import ProviderDashboard from "./pages/provider/providerDashboard";
 import CompleteProfile from "./pages/provider/completeProfile";
 import PendingApproval from "./pages/provider/pendingApproval";
 import JobDetail from "./pages/provider/jobDetails";
 import ProvidersByCategory from "./pages/provider/providerByCategory";


 import AdminDashboard from "./pages/admin/dashboard";
 import AdminProviders from "./pages/admin/adminProviders";
 import AdminCategories from "./pages/admin/adminCategory";
import AdminReviews from "./pages/admin/adminReview";
import AdminBookings from "./pages/admin/adminBooking";
import AdminLayout from "./pages/admin/adminLayout";

const App = () => {
    const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
    const { setAuth, clearAuth ,isLoading} = useAuthStore();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getMe();
        setAuth(response.user._id, response.user.role);
      } catch (err) {
        clearAuth();
      }
    };
    getUser();
  }, []);

    if(isLoading){
      return <div className="text-center text-gray-400 py-10">Loading...</div>
    }
  return (
       <>
       {!isAdminPage && <Navbar />}
    <Routes>

       <Route path="/" element={<Home />} /> 
       <Route path="/providers" element={<BrowseProviders />} /> 
       <Route path="/providers/:id" element={<ProviderProfile />} /> 
       <Route path="/login" element={<Login />} /> 
      <Route path="/register" element={<Register />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
   
      <Route path="/customer/dashboard" element={
        <ProtectedRoute allowedRoles={["customer"]}>
          <CustomerDashboard />
        </ProtectedRoute>
      } />
      <Route path="/customer/bookings" element={
        <ProtectedRoute allowedRoles={["customer"]}>
          <MyBookings />
        </ProtectedRoute>
      } />
      <Route path="/customer/bookings/:id" element={
        <ProtectedRoute allowedRoles={["customer"]}>
          <BookingDetail />
        </ProtectedRoute>
      } />
      <Route path="/customer/book/:providerId" element={
        <ProtectedRoute allowedRoles={["customer"]}>
          <BookingForm />
        </ProtectedRoute>
      } />  

        <Route path="/providers/category/:categoryName" 
       element={<ProvidersByCategory />} /> 


 
       <Route path="/provider/complete-profile" element={
        <ProtectedRoute allowedRoles={["provider"]}>
          <CompleteProfile />
        </ProtectedRoute>
      } />
      <Route path="/provider/pending-approval" element={
        <ProtectedRoute allowedRoles={["provider"]}>
          <PendingApproval />
        </ProtectedRoute>
      } />
     <Route path="/provider/dashboard" element={
        <ProtectedRoute allowedRoles={["provider"]}>
          <ProviderDashboard />
        </ProtectedRoute>
      } />
      <Route path="/provider/jobs/:id" element={
        <ProtectedRoute allowedRoles={["provider"]}>
          <JobDetail />
        </ProtectedRoute>
      } />

         <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
         <AdminLayout><AdminDashboard /></AdminLayout>
           </ProtectedRoute>
               } />
              <Route path="/admin/providers" element={
                <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout><AdminProviders /></AdminLayout>
                    </ProtectedRoute>
                            } />
                   <Route path="/admin/categories" element={
                   <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminLayout><AdminCategories /></AdminLayout>
                     </ProtectedRoute>
                      } />
                         <Route path="/admin/reviews" element={
             <ProtectedRoute allowedRoles={["admin"]}>
               <AdminLayout><AdminReviews /></AdminLayout>
                    </ProtectedRoute>
                         } />
                         <Route path="/admin/bookings" element={
                   <ProtectedRoute allowedRoles={["admin"]}>
                       <AdminLayout><AdminBookings /></AdminLayout>
                   </ProtectedRoute>
                     } />
                  </Routes>
</>
  );
};

export default App;