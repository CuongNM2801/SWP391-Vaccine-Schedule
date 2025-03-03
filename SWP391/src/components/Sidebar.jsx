import React from "react";
import { Col, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function Sidebar() {
	return (
		<Col sm={2} style={{ backgroundColor: "#e0e0e0", paddingTop: "20px" }}>
			<Navbar>
				<Nav defaultActiveKey="/Dashboard" className="flex-column">
					<Navbar.Brand
						href="/"
						style={{
							fontWeight: "bold",
							fontSize: "1.2rem",
							marginBottom: "20px",
							color: "#007bff",
						}}>
						Vaccine Schedule
					</Navbar.Brand>
					<NavLink
						to={"/Dashboard"}
						className={"nav-link"}
						style={({ isActive }) => ({
							backgroundColor: isActive ? "#e9ecef" : "transparent",
							borderRadius: "5px",
							padding: "10px 15px",
							marginBottom: "5px",
							color: "#343a40",
						})}>
						Dashboard
					</NavLink>
					<NavLink
						to={"/ManageAccount"}
						className={"nav-link"}
						style={({ isActive }) => ({
							backgroundColor: isActive ? "#e9ecef" : "transparent",
							borderRadius: "5px",
							padding: "10px 15px",
							marginBottom: "5px",
							color: "#343a40",
						})}>
						Account
					</NavLink>
					<NavLink
						to={"/ManageVaccine"}
						className={"nav-link"}
						style={({ isActive }) => ({
							backgroundColor: isActive ? "#e9ecef" : "transparent",
							borderRadius: "5px",
							padding: "10px 15px",
							marginBottom: "5px",
							color: "#343a40",
						})}>
						Vaccine
					</NavLink>
					<NavLink
						to={"/ManageCombo"}
						className={"nav-link"}
						style={({ isActive }) => ({
							backgroundColor: isActive ? "#e9ecef" : "transparent",
							borderRadius: "5px",
							padding: "10px 15px",
							marginBottom: "5px",
							color: "#343a40",
						})}>
						Vaccine Combo
					</NavLink>
					<NavLink
						to={"/WorkSchedule"}
						className={"nav-link"}
						style={({ isActive }) => ({
							backgroundColor: isActive ? "#e9ecef" : "transparent",
							borderRadius: "5px",
							padding: "10px 15px",
							marginBottom: "5px",
							color: "#343a40",
						})}>
						Work Schedule
					</NavLink>
				</Nav>
			</Navbar>
		</Col>
	);
}

export default Sidebar;
