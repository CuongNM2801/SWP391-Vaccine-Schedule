import React, { useState, useEffect } from "react";
import { Button, Col, Container, Form, Modal, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddCombo from "../components/AddCombo";

function ComboManage() {
	const [combos, setCombos] = useState([]);
	const comboAPI = "";
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		fetch(comboAPI)
			.then((response) => response.json())
			.then((data) => {
				setCombos(data);
			})
			.catch((error) => console.error("Error fetching combos:", error));
	}, []);

	return (
		<>
			<Row>
				<Sidebar />
				<Col>
					<Container>
						<h1>Combo Vaccine Management</h1>
						<Button variant="primary" onClick={() => setIsOpen(true)}>
							Add New Combo
						</Button>
						{isOpen && <AddCombo setIsOpen={setIsOpen} open={isOpen} />}

						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>Combo Name</th>
									<th>Description</th>
									<th>Vaccines</th>
									<th>Target Age Group</th>
									<th>Sale %</th>
									<th>Category</th>
								</tr>
							</thead>
							<tbody>
								{combos.length > 0 ? (
									combos.map((combo) => (
										<tr key={combo.id}>
											<td>{combo.id}</td>
											<td>{combo.name}</td>
											<td>{combo.description}</td>
											<td>{formatVaccines(combo.vaccines)}</td>
											<td>{combo.targetAgeGroup}</td>
											<td>{combo.salePercentage}%</td>
											<td>{combo.category}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="7">No combos added yet.</td>
									</tr>
								)}
							</tbody>
						</Table>
					</Container>
				</Col>
			</Row>
		</>
	);
	{
		/* <Modal show={showModal} onHide={handleCloseModal} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Add New Combo Vaccine</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						<Form.Group className="mb-3" controlId="formGridComboName">
							<Form.Label>Combo Name *</Form.Label>
							<Form.Control type="text" placeholder="Enter Combo Name" value={comboName} onChange={(e) => setComboName(e.target.value)} isInvalid={!!errors.comboName} aria-label="Combo Name" />
							<Form.Control.Feedback type="invalid">{errors.comboName}</Form.Control.Feedback>
						</Form.Group>

						<Form.Group className="mb-3" controlId="formGridComboDescription">
							<Form.Label>Description</Form.Label>
							<Form.Control as="textarea" rows={3} placeholder="Enter Combo Description" value={comboDescription} onChange={(e) => setComboDescription(e.target.value)} aria-label="Combo Description" />
						</Form.Group>

						<Form.Group className="mb-3" controlId="formGridVaccines">
							<Form.Label>Select Vaccines *</Form.Label>
							{errors.selectedVaccines && <div className="text-danger">{errors.selectedVaccines}</div>}
							{vaccines.map((vaccine) => (
								<div key={vaccine.id} className="mb-2">
									<Form.Check
										type="checkbox"
										id={`vaccine-${vaccine.id}`}
										label={vaccine.name}
										checked={selectedVaccines.some((v) => v.vaccineId === vaccine.id)}
										onChange={() => handleVaccineSelect(vaccine.id)}
										inline
									/>
									{selectedVaccines.some((v) => v.vaccineId === vaccine.id) && (
										<Form.Control
											type="number"
											min="1"
											value={selectedVaccines.find((v) => v.vaccineId === vaccine.id).doses}
											onChange={(e) => handleDoseChange(vaccine.id, e.target.value)}
											style={{ width: "80px", display: "inline-block", marginLeft: "10px" }}
										/>
									)}
								</div>
							))}
						</Form.Group>

						<Row className="mb-3">
							<Form.Group as={Col} controlId="formGridTargetAgeGroup">
								<Form.Label>Target Age Group *</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter Target Age Group (e.g., 0-6 months)"
									value={targetAgeGroup}
									onChange={(e) => setTargetAgeGroup(e.target.value)}
									isInvalid={!!errors.targetAgeGroup}
									aria-label="Target Age Group"
								/>
								<Form.Control.Feedback type="invalid">{errors.targetAgeGroup}</Form.Control.Feedback>
							</Form.Group>

							<Form.Group as={Col} controlId="formGridSalePercentage">
								<Form.Label>Sale Percentage *</Form.Label>
								<Form.Control
									type="number"
									placeholder="Enter Sale Percentage (0-100)"
									value={salePercentage}
									onChange={(e) => setSalePercentage(e.target.value)}
									isInvalid={!!errors.salePercentage}
									aria-label="Sale Percentage"
								/>
								<Form.Control.Feedback type="invalid">{errors.salePercentage}</Form.Control.Feedback>
							</Form.Group>
						</Row>
						<Row className="mb-3">
							<Form.Group as={Col} controlId="formGridComboCategory">
								<Form.Label>Combo Category *</Form.Label>
								<Form.Select value={comboCategory} onChange={(e) => setComboCategory(e.target.value)} isInvalid={!!errors.comboCategory} aria-label="Combo Category">
									<option value="">Select a category...</option>
									{comboCategories.map((category, index) => (
										<option key={index} value={category}>
											{category}
										</option>
									))}
									<option value="New">Add New Category</option>
								</Form.Select>
								<Form.Control.Feedback type="invalid">{errors.comboCategory}</Form.Control.Feedback>
							</Form.Group>

							{comboCategory === "New" && (
								<Form.Group as={Col} controlId="formGridNewComboCategory">
									<Form.Label>New Category Name *</Form.Label>
									<Form.Control
										type="text"
										placeholder="Enter New Category Name"
										value={newComboCategory}
										onChange={(e) => setNewComboCategory(e.target.value)}
										isInvalid={!!errors.newComboCategory}
										aria-label="New Category Name"
									/>
									<Form.Control.Feedback type="invalid">{errors.newComboCategory}</Form.Control.Feedback>
								</Form.Group>
							)}
						</Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseModal}>
						Close
					</Button>
					<Button variant="primary" onClick={handleSaveCombo}>
						Save Combo
					</Button>
				</Modal.Footer>
			</Modal> */
	}
}

export default ComboManage;
