import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Modal, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddVaccine from "../components/AddVaccine";

function VaccineManage() {
	const [vaccines, setVaccines] = useState([]);
	// const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const vaccineAPI = "http://localhost:8080/vaccine/get";

	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		fetch(vaccineAPI)
			.then((response) => response.json())
			.then((data) => {
				setVaccines(data.result);
			})
			.catch((error) => console.error("Error fetching vaccines:", error));
	}, []);

	return (
		<>
			<Row>
				<Sidebar />
				<Col>
					<Container>
						{console.log(vaccines)}
						<h1>Vaccine Manage</h1>
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
									<th>Image</th>
									<th>Description</th>
									<th>Manufacturer</th>
									<th>Quantity</th>
									<th>Status</th>
									<th colSpan={2}></th>
								</tr>
							</thead>
							<tbody>
								{vaccines.length > 0 ? (
									vaccines.map((vaccine) => (
										<tr key={vaccine.id}>
											<td>{vaccine.id}</td>
											<td>{vaccine.name}</td>
											<td>{vaccine.image}</td>
											<td>{vaccine.description}</td>
											<td>{vaccine.manufacturer}</td>
											<td>{vaccine.quantity}</td>
											<td>{vaccine.status}</td>
											<td colSpan={2}>
												<Button>Update</Button>
												<Button>Delete</Button>
											</td>
										</tr>
									))
								) : (
									<>
										<tr>
											<td>ID</td>
											<td>Covid19 Vaccine</td>
											<td>
												<Image src="src/alt/notfound.jpg" thumbnail height={30} />
											</td>
											<td>
												Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut aspernatur voluptatibus sunt illo natus, soluta eius esse explicabo quas laboriosam? Rem exercitationem quis culpa iure cumque
												molestiae libero, voluptate dolore.
											</td>
											<td>ABC Co.</td>
											<td>30</td>
											<td>Available</td>
											<td colSpan={2}>
												<Button>Update</Button>
												<Button>Delete</Button>
											</td>
										</tr>
										<tr>
											<td colSpan={8}>No vaccine added yet</td>
										</tr>
									</>
								)}
							</tbody>
						</Table>
					</Container>
				</Col>
			</Row>
		</>
	);
}

export default VaccineManage;
