import { useFormik } from "formik";
import React from "react";
import { Button, Col, Form, InputGroup, Modal, Row, Table } from "react-bootstrap";

function AddCombo({ setIsOpen, open }) {
	const addComboAPI = "http://localhost:8080/vaccine/combo/add";
	const addComDetailAPI = "";

	const handleClose = () => setIsOpen(false); //Close modal

	const formik = useFormik({
		initialValues: {
			comboName: "",
			description: "",
			saleOff: 0,
			ageGroup: "",
		},
		onSubmit: (values) => {
			handleAddCombo(values);
		},
	});

	const handleAddCombo = async (values) => {
		try {
			console.log(values);
			const response = await fetch(addComboAPI, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
			});
			if (response.ok) {
				console.log("Add combo successful, proceed to adding combo detail");

				handleClose();
			} else {
				console.error("Adding combo failed: ", response.status);
				alert("Adding combo failed. Please try again.");
			}
		} catch (err) {
			console.error("Add combo error:", err);
			alert("An error occurred during adding child. Please try again.");
		}
	};

	return (
		<div>
			<Modal show={open} onHide={handleClose} size="lg">
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Combo Vaccine</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group className="mb-3" controlId="formGridComboName">
							<Form.Label>Combo Name *</Form.Label>
							<Form.Control type="text" placeholder="Enter Combo Name" name="comboName" value={formik.values.comboName} onChange={formik.handleChange} />
							{/* <Form.Control.Feedback type="invalid">{errors.comboName}</Form.Control.Feedback> */}
						</Form.Group>
						<Form.Group className="mb-3" controlId="formGridComboDescription">
							<Form.Label>Description</Form.Label>
							<Form.Control as="textarea" rows={3} placeholder="Enter Combo Description" name="description" value={formik.values.description} onChange={formik.handleChange} />
							{/* <Form.Control.Feedback type="invalid">{errors.comboName}</Form.Control.Feedback> */}
						</Form.Group>
						<Row>
							<Col>
								<InputGroup className="mb-3">
									<Form.Control placeholder="Vaccine name..." aria-label="Vaccine name" aria-describedby="basic-addon2" />
									<Button variant="outline-secondary" id="button-addon2">
										Search
									</Button>
								</InputGroup>
								<Table striped bordered hover responsive>
									<thead>
										<tr>
											<th></th>
											<th>#</th>
											<th>Vaccine name</th>
											<th>Category</th>
											<th>Dose</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												<Form.Check inline name="vaccineid" type={"checkbox"} id={`inline-checkbox-1`} />
											</td>
											<td>1</td>
											<td>Covid 19</td>
											<td>Covid</td>
											<td>
												<Form.Group className="mb-3" controlId="dose">
													<Form.Control type="number" placeholder="Enter dose" name="dose" />
													{/* <Form.Control.Feedback type="invalid">{errors.comboName}</Form.Control.Feedback> */}
												</Form.Group>
											</td>
										</tr>
									</tbody>
								</Table>
							</Col>
							<Col>
								<Form.Group className="mb-3" controlId="sale">
									<Form.Label>Sale off</Form.Label>
									<Form.Control type="number" placeholder="Enter sale" name="saleOff" />
									{/* <Form.Control.Feedback type="invalid">{errors.comboName}</Form.Control.Feedback> */}
								</Form.Group>
								<Form.Group className="mb-3" controlId="ageGroup">
									<Form.Label>Age group</Form.Label>
									<Form.Control type="text" placeholder="Enter age group" name="ageGroup" />
									{/* <Form.Control.Feedback type="invalid">{errors.comboName}</Form.Control.Feedback> */}
								</Form.Group>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button variant="primary" type="submit">
							Save Changes
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default AddCombo;
