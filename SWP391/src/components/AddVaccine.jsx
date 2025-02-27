import { useFormik } from "formik";
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

function AddVaccine({ setIsOpen, open }) {
	const childAPI = "";

	const handleClose = () => setIsOpen(false); //Close modal

	const formik = useFormik({
		initialValues: {},
		onSubmit: (values) => {
			handleAddVaccine(values);
		},
	});

	const handleAddVaccine = (values) => {
		console.log(values);
		handleClose();
	};

	const handleFileChange = (event) => {
		formik.setFieldValue("imageUrl", event.currentTarget.files[0]);
	};

	return (
		<div>
			<Modal show={open} onHide={handleClose} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>Add New Vaccine</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form method="POST" onSubmit={formik.handleSubmit}>
						<Row className="mb-3">
							<Form.Group as={Col} controlId="formGridVaccineName">
								<Form.Label>Vaccine Name *</Form.Label>
								<Form.Control type="text" placeholder="Enter Vaccine Name" aria-label="Vaccine Name" />
								{/* <Form.Control.Feedback type="invalid">{errors.vaccineName}</Form.Control.Feedback> */}
							</Form.Group>

							<Form.Group as={Col} controlId="formGridOrigin">
								<Form.Label>Origin *</Form.Label>
								<Form.Control type="text" placeholder="Enter Origin" aria-label="Origin" />
								{/* <Form.Control.Feedback type="invalid">{errors.origin}</Form.Control.Feedback> */}
							</Form.Group>
						</Row>

						<Form.Group className="mb-3" controlId="formGridDescription">
							<Form.Label>Description</Form.Label>
							<Form.Control as="textarea" rows={3} placeholder="Enter Description" aria-label="Description" />
						</Form.Group>

						<Row className="mb-3">
							<Form.Group as={Col} controlId="formGridInstructions">
								<Form.Label>Instructions</Form.Label>
								<Form.Control as="textarea" rows={3} placeholder="Enter Instructions" aria-label="Instructions" />
							</Form.Group>

							<Form.Group as={Col} controlId="formGridContraindications">
								<Form.Label>Contraindications</Form.Label>
								<Form.Control as="textarea" rows={3} placeholder="Enter Contraindications" aria-label="Contraindications" />
							</Form.Group>
						</Row>

						<Row className="mb-3">
							<Form.Group as={Col} controlId="formGridPrecautions">
								<Form.Label>Precautions</Form.Label>
								<Form.Control as="textarea" rows={3} placeholder="Enter Precautions" aria-label="Precautions" />
							</Form.Group>

							<Form.Group as={Col} controlId="formGridInteractions">
								<Form.Label>Interactions</Form.Label>
								<Form.Control as="textarea" rows={3} placeholder="Enter Interactions" aria-label="Interactions" />
							</Form.Group>
						</Row>

						<Row className="mb-3">
							<Form.Group as={Col} controlId="formGridSideEffects">
								<Form.Label>Side Effects</Form.Label>
								<Form.Control as="textarea" rows={3} placeholder="Enter Side Effects" aria-label="Side Effects" />
							</Form.Group>

							<Form.Group as={Col} controlId="formGridStorageInstructions">
								<Form.Label>Storage Instructions</Form.Label>
								<Form.Control as="textarea" rows={3} placeholder="Enter Storage Instructions" aria-label="Storage Instructions" />
							</Form.Group>
						</Row>

						<Row className="mb-3">
							<Form.Group controlId="formGridPostVaccinationReactions">
								<Form.Label>Post-Vaccination Reactions</Form.Label>
								<Form.Control as="textarea" rows={3} placeholder="Enter Post-Vaccination Reactions" aria-label="Post-Vaccination Reactions" />
							</Form.Group>
						</Row>

						<Form.Group controlId="formGridImage" className="mb-3">
							<Form.Label>Vaccine Image</Form.Label>
							<Form.Control type="file" onChange={handleFileChange} aria-label="Vaccine Image" />
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="primary" type="submit">
						Save Changes
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default AddVaccine;
