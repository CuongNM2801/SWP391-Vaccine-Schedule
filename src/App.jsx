import "./App.css";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import PriceListPage from "./pages/PriceListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import VaccineDetail from "./pages/VaccineDetail";
import AccountManage from "./admin/AccountManage";
import VaccineManage from "./admin/VaccineManage";
import ComboManage from "./admin/ComboManage";
import WorkSchedule from "./admin/WorkSchedule";
import BookingPage from "./pages/BookingPage";
import VaccineList from "./pages/VaccineList";
import ComboList from "./pages/ComboList";
import UserProfile from "./pages/UserProfile";
import UserChildren from "./pages/UserChildren";
import UserScheduling from "./pages/UserScheduling";
import UserHistory from "./pages/UserHistory";
import HealthRecord from "./pages/HealthRecord";
import Dashboard from "./admin/Dashboard";
import StaffHome from "./staff/StaffHome";
import CheckIn from "./staff/CheckIn";
import Schedule from "./staff/Schedule";
import TransactionPage from "./pages/TransactionPage";
import { jwtDecode } from "jwt-decode";
import ComboDetail from "./pages/ComboDetail";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
	const navigate = useNavigate();
	const api = "http://localhost:8080/auth/refresh";
	const token = localStorage.getItem("token");
	const decodedToken = token ? jwtDecode(token) : null;
	const [stripePromise, setStripePromise] = useState(null);
	const [stripeError, setStripeError] = useState(null);

	useEffect(() => {
		// Initialize Stripe
		const initializeStripe = async () => {
			try {
				// const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
				// Get Stripe publishable key from environment variables
				const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
				console.log("Stripe key present:", !!stripeKey);
				
				if (!stripeKey) {
					setStripeError("Stripe key is missing. Check environment variables.");
					return;
				}
				
				// Initialize Stripe
				const stripe = await loadStripe(stripeKey);
				// if (!stripe) {
				// 	throw new Error('Failed to load Stripe');
				// }
				// setStripePromise(stripe);
				// console.log("Stripe initialized successfully");
								
				if (stripe) {
					console.log("Stripe initialized successfully");
					setStripePromise(stripe);
				} else {
					setStripeError("Failed to initialize Stripe. The loadStripe function returned null.");
				}
			} catch (error) {
				// console.error('Error initializing Stripe:', error);
				// // Handle error appropriately
				console.error("Error initializing Stripe:", error);
				setStripeError(`Failed to initialize Stripe: ${error.message}`);
			}
		};
		
		initializeStripe();
	}, []);

	useEffect(() => {
		if (token) {
			axios.get("http://localhost:8080/test")
				.then((response) => {
					console.log(response.data);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, []);

	const isLoggedIn = !!token;

	const ProtectedRoute = ({ element: Component, guestOnly, userOnly, adminOnly, staffOnly, ...rest }) => {
		if (guestOnly && isLoggedIn) {
			return <Navigate to="/" replace />;
		}
		if (userOnly && !isLoggedIn) {
			return <Navigate to="/login" replace />;
		}

		if (adminOnly && (!isLoggedIn || decodedToken.scope !== "ADMIN")) {
			// Admin roleid is "ADMIN"
			return <Navigate to="/" replace />;
		}

		if (staffOnly && (!isLoggedIn || decodedToken.scope !== "STAFF")) {
			// Staff roleid is "STAFF"
			return <Navigate to="/" replace />;
		}

		return <Component {...rest} />;
	};

	return (
		<>
			{stripeError && (
				<div className="alert alert-danger m-3">
					<strong>Stripe Initialization Error:</strong> {stripeError}
				</div>
			)}
			
			<Elements stripe={stripePromise}>
				<Routes>
					{console.log(decodedToken)}
					<Route path={"/"} element={<HomePage />} />
					<Route path={"/AboutUs"} element={<AboutUsPage />} />
					<Route path={"/PriceList"} element={<PriceListPage />} />
					<Route path={"/Booking"} element={<BookingPage />} />
					<Route path={"/VaccineList"} element={<VaccineList />} />
					<Route path={"/ComboList"} element={<ComboList />} />
					<Route path={"/VaccineDetail/:id"} element={<VaccineDetail />} />
					<Route path={"/ComboDetail/:id"} element={<ComboDetail />} />

					{/*Guest only*/}
					<Route path={"/Login"} element={<ProtectedRoute element={LoginPage} guestOnly />} />
					<Route path={"/Register"} element={<ProtectedRoute element={RegisterPage} guestOnly />} />

					{/*User only */}
					<Route path={"/User/Profile"} element={<ProtectedRoute element={UserProfile} userOnly />} />
					<Route path={"/User/Children"} element={<ProtectedRoute element={UserChildren} userOnly />} />
					<Route path={"/User/Scheduling"} element={<ProtectedRoute element={UserScheduling} userOnly />} />
					<Route path={"/User/History"} element={<ProtectedRoute element={UserHistory} userOnly />} />
					<Route path={"/User/Record"} element={<ProtectedRoute element={HealthRecord} userOnly />} />

					<Route path={"/Transaction"} element={<ProtectedRoute element={TransactionPage} userOnly />} />

					{/*Admin only*/}
					{/* 
			<Route path={"/Admin/Dashboard"} element={<ProtectedRoute element={Dashboard} adminOnly />} />
			<Route path={"/Admin/ManageAccount"} element={<ProtectedRoute element={AccountManage} adminOnly />} />
			<Route path={"/Admin/ManageVaccine"} element={<ProtectedRoute element={VaccineManage} adminOnly />} />
			<Route path={"/Admin/ManageCombo"} element={<ProtectedRoute element={ComboManage} adminOnly />} />
			<Route path={"/Admin/WorkSchedule"} element={<ProtectedRoute element={WorkSchedule} adminOnly />} />
			 */}

					{/*Staff only */}
					{/* 
			<Route path={"/Staff/StaffPage"} element={<ProtectedRoute element={StaffHome} staffOnly />} />
			<Route path={"/Staff/CheckIn"} element={<ProtectedRoute element={CheckIn} staffOnly />} />
			<Route path={"/Staff/Schedule"} element={<ProtectedRoute element={Schedule} staffOnly />} />
			 */}

					{/*Use this path only in developement. When role is OK, use the Admin and Staff only route */}
					<Route path={"/Admin/Dashboard"} element={<ProtectedRoute element={Dashboard} userOnly />} />
					<Route path={"/Admin/ManageAccount"} element={<ProtectedRoute element={AccountManage} userOnly />} />
					<Route path={"/Admin/ManageVaccine"} element={<ProtectedRoute element={VaccineManage} userOnly />} />
					<Route path={"/Admin/ManageCombo"} element={<ProtectedRoute element={ComboManage} userOnly />} />
					<Route path={"/Admin/WorkSchedule"} element={<ProtectedRoute element={WorkSchedule} userOnly />} />
					<Route path={"/Staff/StaffPage"} element={<ProtectedRoute element={StaffHome} userOnly />} />
					<Route path={"/Staff/CheckIn"} element={<ProtectedRoute element={CheckIn} userOnly />} />
					<Route path={"/Staff/Schedule"} element={<ProtectedRoute element={Schedule} userOnly />} />
				</Routes>
			</Elements>
		</>
	);
}

export default App;
