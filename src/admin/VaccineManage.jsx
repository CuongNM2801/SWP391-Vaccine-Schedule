import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Image, Modal, Pagination, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddVaccine from "../components/AddVaccine";

function VaccineManage() {
	// const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const [vaccines, setVaccines] = useState([]);
	const apiUrl = "http://localhost:8080/vaccine/get";

	const [isOpen, setIsOpen] = useState(false); //Form Add Vaccine

	//For pagination
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5; // Number of items per page
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	// const currentVaccines = vaccines.slice(indexOfFirstItems, indexOfLastItems);
	const currentVaccines = vaccines && vaccines.length > 0 ? vaccines.slice(indexOfFirstItems, indexOfLastItems) : [];
	const totalPages = Math.ceil(vaccines.length / itemsPerPage);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	let items = [];
	for (let number = 1; number <= totalPages; number++) {
		items.push(
			<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
				{number}
			</Pagination.Item>
		);
	}

	const pagination = (
		<Pagination>
			<Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
			<Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
			{items}
			<Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
			<Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
		</Pagination>
	);

	useEffect(() => {
		fetchVaccine();
	}, []);

	const fetchVaccine = async () => {
		try {
			const response = await fetch(apiUrl);
			if (response.ok) {
				const data = await response.json();
				console.log("Vaccines:", data);
				setVaccines(data.result);
			} else {
				console.error("Fetching vaccine failed: ", response.status);
			}
		} catch (err) {
			console.error("Error fetching vaccine: ", err);
		}
	};

	const handleVaccineAdded = (newVaccine) => {
		if (newVaccine) {
			setVaccines([newVaccine, ...vaccines]);
		} else {
			fetchVaccine();
		}
	};

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col lg={10}>
					<Container className="py-4">
						{/* {console.log(vaccines)} */}
						<Row className="mb-4 align-items-center">
							<Col>
								<h1 className="text-primary">Vaccine Management</h1>
							</Col>
							<Col className="text-end">
								<Button variant="primary" onClick={() => setIsOpen(true)}>
									Add New Vaccine
								</Button>
							</Col>
						</Row>
						{isOpen && <AddVaccine setIsOpen={setIsOpen} open={isOpen} onAdded={handleVaccineAdded} />}
						<hr className="mb-4"></hr>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>ID</th>
									<th>Vaccine Name</th>
									<th>Image</th>
									<th>Description</th>
									<th>Manufacturer</th>
									<th>Quantity</th>
									<th>Unit Price ($)</th>
									<th>Sale Price ($)</th>
									<th>Total Doses</th>
									<th>Status</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{/* {vaccines.length > 0 ? (
									vaccines.map((vaccine) => ( */}
								{/* {currentVaccines.length > 0 ? ( //Use currentVaccines for pagination
									currentVaccines.map((vaccine, index) => ( */}
									{currentVaccines.length > 0 ? (
									currentVaccines.map((vaccine) => (
										<tr key={vaccine.id}>
											<td>{vaccine.id}</td>
											<td>{vaccine.name}</td>
											<td>
												<Image src={vaccine.imagineUrl} alt={`${vaccine.name} image`} thumbnail style={{ maxWidth: '100px' }}/>
											</td>
											<td>
												{vaccine.description && vaccine.description.length > 100 
													? `${vaccine.description.substring(0, 100)}...` 
													: vaccine.description}
											</td>
											<td>{vaccine.manufacturer}</td>
											<td>{vaccine.quantity}</td>
											<td>${vaccine.unitPrice}</td>
											<td>${vaccine.salePrice}</td>
											<td>
												<Badge bg="info">{vaccine.totalDose}</Badge>
											</td>
											<td>
												{vaccine.status 
													? (vaccine.quantity > 0 
														? <Badge bg="success">Available</Badge> 
														: <Badge bg="warning">Out of Stock</Badge>)
													: <Badge bg="danger">Disabled</Badge>}
											</td>
											<td>
												<Button variant="info" size="sm" className="me-2 mb-1">
													Protocol
												</Button>
												<Button variant="primary" size="sm" className="me-2 mb-1">
													Edit
												</Button>
												<Button variant="danger" size="sm" className="mb-1">
													Delete
												</Button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={11}>No vaccine added yet</td>
									</tr>
								)}
							</tbody>
						</Table>
						{pagination}
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default VaccineManage;
