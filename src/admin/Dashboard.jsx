import React, { useEffect, useState } from "react";
import { Card, Table, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function Dashboard() {
	const api = "http://localhost:8080";
	const token = localStorage.getItem("token");
	const [accountError, setAccountError] = useState("");
	const [accountList, setAccountList] = useState([]);
	const [vaccineError, setVaccineError] = useState("");
	const [vaccineList, setVaccineList] = useState([]);
	const [comboError, setComboError] = useState("");
	const [comboList, setComboList] = useState([]);

	useEffect(() => {
		getAccount();
		getVaccine();
		getCombo();
	}, [token]);

	const getAccount = async () => {
		try {
			const response = await fetch(`${api}/users/getAllUser`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (!response.ok) {
				console.error("Failed to get accounts");
				throw new Error("Failed to get accounts");
			}
			const data = await response.json();
			setAccountList(data.result);
		} catch (err) {
			setAccountError(err.message);
		}
	};

	const getVaccine = async () => {
		try {
			const response = await fetch(`${api}/vaccine/get`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (!response.ok) {
				console.error("Failed to get vaccines");
				throw new Error("Failed to get vaccines");
			}
			const data = await response.json();
			setVaccineList(data.result);
		} catch (err) {
			setVaccineError(err.message);
		}
	};

	const getCombo = async () => {
		try {
			const response = await fetch(`${api}/vaccine/get/comboDetail`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (!response.ok) {
				console.error("Failed to get combos");
				throw new Error("Failed to get combos");
			}
			const data = await response.json();
			const groupedCombos = groupCombos(data.result);
			setComboList(groupedCombos);
		} catch (err) {
			setComboError(err.message);
		}
	};

	const groupCombos = (combosData) => {
		const grouped = {};
		combosData.forEach((combo) => {
			if (!grouped[combo.comboId]) {
				grouped[combo.comboId] = {
					comboId: combo.comboId,
					comboName: combo.comboName,
					description: combo.description,
					comboCategory: combo.comboCategory,
					saleOff: combo.saleOff,
					total: combo.total,
					vaccines: [], // Initialize vaccines array
				};
			}
			grouped[combo.comboId].vaccines.push({ name: combo.vaccineName, manufacturer: combo.manufacturer, dose: combo.dose });
		});
		// Convert grouped object to array
		return Object.values(grouped);
	};

	return (
		<div className="bg-gray-100 min-h-screen">
			{console.log(accountList, vaccineList, comboList)}
			<Row>
				<Sidebar />
				<Col>
					<Container className="py-4">
						<h1 className="mb-4 text-primary">Dashboard</h1>
						<hr className="mb-4" />

						<Row className="mb-4">
							{[
								{ title: "Total Accounts", value: 1200, color: "bg-blue-200" },
								{ title: "Total Vaccines", value: 35, color: "bg-green-200" },
								{ title: "Total Bookings", value: 520, color: "bg-yellow-200" },
								{ title: "Total Sales ($)", value: "$50,000", color: "bg-red-200" },
							].map((stat, index) => (
								<Col md={3} key={index}>
									<Card className="shadow-md rounded-lg border-0">
										<div className={`p-3 text-center ${stat.color} rounded-lg`}>
											<h5 className="text-lg font-bold text-gray-700">{stat.title}</h5>
											<p className="text-2xl font-semibold text-blue-600">{stat.value}</p>
										</div>
									</Card>
								</Col>
							))}
						</Row>

						{/* Users & Staff Tables */}
						<Row className="mb-4">
							<Col md={6}>
								<Card className="shadow-md p-3">
									<div className="flex justify-between items-center mb-3">
										<h5 className="text-lg font-bold">Account Table</h5>
										<Link to="/Admin/ManageAccount" className="text-blue-600 hover:underline">
											Manage Accounts
										</Link>
									</div>
									<Table striped bordered hover>
										<thead>
											<tr>
												<th>UserID</th>
												<th>Full Name</th>
												<th>Username</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>1</td>
												<td>John Doe</td>
												<td>johndoe</td>
											</tr>
										</tbody>
									</Table>
								</Card>
							</Col>
							<Col md={6}>
								<Card className="shadow-md p-3">
									<div className="flex justify-between items-center mb-3">
										<h5 className="text-lg font-bold">Staff Table</h5>
										<Link to="/Admin/WorkSchedule" className="text-blue-600 hover:underline">
											Scheduling
										</Link>
									</div>
									<Table striped bordered hover>
										<thead>
											<tr>
												<th>UserID</th>
												<th>Full Name</th>
												<th>Username</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td>101</td>
												<td>Jane Smith</td>
												<td>janesmith</td>
											</tr>
										</tbody>
									</Table>
								</Card>
							</Col>
						</Row>

						{/* Vaccine Table */}
						<Card className="shadow-md p-3 mb-4">
							<div className="flex justify-between items-center mb-3">
								<h5 className="text-lg font-bold">Vaccine Table</h5>
								<Link to="/Admin/ManageVaccine" className="text-blue-600 hover:underline">
									Manage Vaccines
								</Link>
							</div>
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Vaccine ID</th>
										<th>Name</th>
										<th>Type</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>V001</td>
										<td>COVID-19 Vaccine</td>
										<td>mRNA</td>
									</tr>
								</tbody>
							</Table>
						</Card>

						{/* Combo Table */}
						<Card className="shadow-md p-3">
							<div className="flex justify-between items-center mb-3">
								<h5 className="text-lg font-bold">Combo Table</h5>
								<Link to="/Admin/ManageCombo" className="text-blue-600 hover:underline">
									Manage Combos
								</Link>
							</div>
							<Table striped bordered hover>
								<thead>
									<tr>
										<th>Combo ID</th>
										<th>Name</th>
										<th>Description</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>C001</td>
										<td>Child Vaccine Package</td>
										<td>Includes 5 essential vaccines</td>
									</tr>
								</tbody>
							</Table>
						</Card>
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default Dashboard;
