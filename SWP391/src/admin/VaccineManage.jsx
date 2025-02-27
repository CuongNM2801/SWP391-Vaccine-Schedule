import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar"; // Assuming Sidebar is correctly implemented
import AddVaccine from "../components/AddVaccine";

function VaccineManage() {
	const [vaccines, setVaccines] = useState([]);
	const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";

	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		fetch(vaccineAPI)
			.then((response) => response.json())
			.then((data) => {
				setVaccines(data);
			})
			.catch((error) => console.error("Error fetching vaccines:", error));
	}, []);
	return (
		<>
			<Sidebar />
			<Container>
				<h1>Vaccine Manage</h1>
				{console.log(vaccines)}
				<Button
					variant="primary"
					onClick={() => {
						setIsOpen(true);
					}}
					className="mb-3">
					Add New Vaccine
				</Button>
				{isOpen && <AddVaccine setIsOpen={setIsOpen} open={isOpen} />}
				<Table striped bordered hover responsive>
					<thead>
						<tr>
							<th>#</th>
							<th>Vaccine Name</th>
							<th>Description</th>
							<th>Origin</th>
							<th>Quantity</th>
							<th>Status</th>
							<th>Type</th>
						</tr>
					</thead>
					<tbody>
						{vaccines.map((vaccine) => (
							<tr key={vaccine.id}>
								<td>{vaccine.id}</td>
								<td>{vaccine.name}</td>
								<td>{vaccine.description}</td>
								<td>{vaccine.manufacturer}</td>
								<td>{vaccine.quantity}</td>
								<td>{vaccine.status}</td>
								<td>{vaccine.category}</td>
							</tr>
						))}
					</tbody>
				</Table>
			</Container>
		</>
	);
}

export default VaccineManage;
