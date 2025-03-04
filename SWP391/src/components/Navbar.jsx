import React, { useEffect, useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navigation() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [username, setUsername] = useState("");
	const [role, setRole] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsLoggedIn(true);
			try {
				const decodedToken = jwtDecode(token);
				console.log(decodedToken);
				setUsername(decodedToken.sub);
			} catch (err) {
				console.error("Error decoding token:", err);
			}
		} else {
			setIsLoggedIn(false);
		}
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsLoggedIn(false);
		navigate("/Login"); // Navigate to Login page after logout
	};

	return (
		<>
			<Container>
				<Navbar expand="lg" className="bg-body-tertiary">
					<Container>
						<Navbar.Brand href="/">Vaccine Schedule System</Navbar.Brand>
					</Container>
					<Nav className="justify-content-end">
						{isLoggedIn ? (
							<NavDropdown title={username} id="basic-nav-dropdown">
								<NavLink to={"/Profile"} className={"dropdown-item"}>
									Profile
								</NavLink>
								<NavLink to={"/Children"} className={"dropdown-item"}>
									Children Management
								</NavLink>
								<NavLink to={"/Scheduling"} className={"dropdown-item"}>
									Booking Schedule
								</NavLink>
								<NavLink to={"/History"} className={"dropdown-item"}>
									Vaccination History
								</NavLink>
								<NavLink to={"/Record"} className={"dropdown-item"}>
									Health Record
								</NavLink>
								<NavDropdown.Divider />
								<NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
							</NavDropdown>
						) : (
							<NavLink to={"/Login"} className={"nav-link"}>
								Login
							</NavLink>
						)}
					</Nav>
				</Navbar>
			</Container>
			<Navbar bg="dark" data-bs-theme="dark">
				<Container>
					<Nav className="me-auto">
						<NavLink to={"/"} className={"nav-link"}>
							Home
						</NavLink>
						<NavLink to={"/AboutUs"} className={"nav-link"}>
							About Us
						</NavLink>
						<NavLink to={"/PriceList"} className={"nav-link"}>
							Price List
						</NavLink>
						<NavDropdown title="Information" id="basic-nav-dropdown">
							<NavLink to={"/VaccineList"} className={"dropdown-item"}>
								Vaccine List
							</NavLink>
							<NavLink to={"/ComboList"} className={"dropdown-item"}>
								Vaccine Combo List
							</NavLink>
						</NavDropdown>
						<NavLink to={"/Booking"} className={"nav-link"}>
							Booking
						</NavLink>
					</Nav>
					{isLoggedIn && (
						<Nav className="justify-content-end">
							<NavLink to={"/Dashboard"} className={"nav-link"}>
								Admin Page
							</NavLink>
							<NavLink to={"#"} className={"nav-link"}>
								Staff Page
							</NavLink>
						</Nav>
					)}
				</Container>
			</Navbar>
		</>
	);
}

export default Navigation;
