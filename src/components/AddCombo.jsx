import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { Button, Col, Form, InputGroup, Modal, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function AddCombo({ setIsOpen, open }) {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const vaccineAPI = "http://localhost:8080/vaccine";
	const comboAPI = "http://localhost:8080/vaccine/combo";

	const [searchName, setSearchName] = useState("");
	const [vaccineList, setVaccineList] = useState([]);
	const [selectedVaccines, setSelectedVaccines] = useState([]);

	const handleClose = () => setIsOpen(false); //Close modal

	const validation = Yup.object({
		comboName: Yup.string().required("Combo Name is required"),
		description: Yup.string().required("Description is required").min(30, "Description must be at least 30 characters"),
		saleOff: Yup.number().min(0, "Sale cannot be negative").max(100, "Sale cannot go pass 100%"),
		comboCategory: Yup.string().required("Combo category is required"),
	});

	const formik = useFormik({
		initialValues: {
			comboName: "",
			description: "",
			saleOff: 0,
			comboCategory: "",
		},
		onSubmit: (values) => {
			handleAddCombo(values);
		},
		validationSchema: validation,
	});

	//Add vaccine to Selected Vaccine List
	const handleSelectVaccine = (vaccine) => {
		const isSelected = selectedVaccines.some((v) => v.vaccine.id === vaccine.id);
		if (isSelected) {
			//Unchose the vaccine
			setSelectedVaccines(selectedVaccines.filter((v) => v.vaccine.id !== vaccine.id));
		} else {
			setSelectedVaccines([...selectedVaccines, { vaccine, dose: 1 }]);
		}
	};

	//Add the vaccine combo first
	const handleAddCombo = async (values) => {
		if (selectedVaccines.length === 0) {
			alert("Please select at least one vaccine before adding the combo.");
			return;
		}
		try {
			const comboData = {
				comboName: values.comboName,
				description: values.description,
			};
			const response = await fetch(`${comboAPI}/add`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(comboData),
			});
			if (response.ok) {
				const data = await response.json();
				const comboId = data.result.id;
				console.log("ComboId: ", comboId, ". Next is adding combo detail"); //Get the comboId for the addComboDetail func
				handleAddComboDetail(values, comboId);
			} else {
				console.error("Adding combo failed: ", response.status);
			}
		} catch (err) {
			console.log("Add combo failed: ", err);
		}
	};

	//Add vaccine combo detail using the newly create comboId
	const handleAddComboDetail = async (values, comboId) => {
		// console.log(selectedVaccines);
		try {
			let success = true;
			for (const item of selectedVaccines) {
				console.log(item.vaccine.id);
				const detailData = {
					dose: item.dose,
					comboCategory: values.comboCategory,
					saleOff: values.saleOff,
				};
				// console.log(detailData);
				console.log(`${comboAPI}/detail/${comboId}/${item.vaccine.id}`);
				const response = await fetch(`${comboAPI}/detail/${comboId}/${item.vaccine.id}`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(detailData),
				});
				if (response.ok) {
					console.log(`Adding detail for vaccineId ${item.vaccine.id} success`);
				} else {
					console.error(`Adding detail for vaccine ${item.vaccine.id} failed: `, response.status);
					success = false;
				}
			}
			if (success) {
				alert("Adding combo successful!!!");
				handleClose();
				navigate("/Admin/ManageCombo");
				window.location.reload(); // Reload page after redirect
			}
		} catch (err) {
			console.error("Add detail failed: ", err);
		}
	};

	//Get list vaccine
	const getVaccine = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/get`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setVaccineList(data.result);
			} else {
				console.error("Getting vaccine failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when getting vaccine: ", err);
		}
	};

	useEffect(() => {
		getVaccine();
	}, []);

	const searchVaccine = vaccineList.filter((vaccine) => vaccine.name.toLowerCase().includes(searchName.toLowerCase()));

	//Change dose number
	const handleUpdateDose = (vaccineId, newDose) => {
		if (newDose < 1) return; // Ensure dose is at least 1
		setSelectedVaccines((prevSelected) => prevSelected.map((item) => (item.vaccine.id === vaccineId ? { ...item, dose: newDose } : item)));
	};

	return (
		<div>
			{/* {console.log(vaccineList)} */}
			<Modal show={open} onHide={handleClose} size="xl">
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Add New Combo Vaccine</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group className="mb-3" controlId="formGridComboName">
							<Form.Label>Combo Name *</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter Combo Name"
								name="comboName"
								value={formik.values.comboName}
								onChange={formik.handleChange}
								isInvalid={formik.touched.comboName && formik.errors.comboName}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.comboName}</Form.Control.Feedback>
						</Form.Group>
						<Form.Group className="mb-3" controlId="formGridComboDescription">
							<Form.Label>Description</Form.Label>
							<Form.Control
								as="textarea"
								rows={3}
								placeholder="Enter Combo Description"
								name="description"
								value={formik.values.description}
								onChange={formik.handleChange}
								isInvalid={formik.touched.description && formik.errors.description}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.description}</Form.Control.Feedback>
						</Form.Group>
						<Row>
							<Col md={6}>
								<Form.Group className="mb-3" controlId="searchbox">
									<Form.Label>Search vaccine:</Form.Label>
									<Form.Control className="mb-3" placeholder="Vaccine name..." aria-label="Vaccine name" name="search" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
								</Form.Group>
								<Table striped bordered hover responsive>
									<thead>
										<tr>
											<th></th>
											<th>#</th>
											<th>Vaccine name</th>
											<th>Unit Price</th>
											<th>Sale Price</th>
											{/* <th>Dose</th> */}
										</tr>
									</thead>
									<tbody>
										{searchVaccine.length > 0 ? (
											searchVaccine.map((vaccine) => (
												<tr key={vaccine.id}>
													<td>
														<Form.Check inline name="vaccineid" type={"checkbox"} checked={selectedVaccines.some((v) => v.vaccine.id === vaccine.id)} onChange={() => handleSelectVaccine(vaccine)} />
													</td>
													<td>{vaccine.id}</td>
													<td>{vaccine.name}</td>
													<td>{vaccine.unitPrice}</td>
													<td>{vaccine.salePrice}</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan={5}>No result</td>
											</tr>
										)}
									</tbody>
								</Table>
							</Col>
							<Col md={6}>
								<b>Chosen vaccine for combo: </b>
								{selectedVaccines.length > 0 ? (
									<Table borderless>
										<thead>
											<tr>
												<th>ID</th>
												<th>Vaccine name</th>
												<th>Dose</th>
											</tr>
										</thead>
										<tbody>
											{selectedVaccines.map((v) => (
												<tr key={v.vaccine.id}>
													<td>{v.vaccine.id}</td>
													<td>{v.vaccine.name}</td>
													<td>
														<Form.Control type="number" placeholder="Enter dose" value={v.dose} onChange={(e) => handleUpdateDose(v.vaccine.id, Number(e.target.value))} />
													</td>
												</tr>
											))}
										</tbody>
									</Table>
								) : (
									<p>Not chosen</p>
								)}
								<Form.Group className="mb-3" controlId="sale">
									<Form.Label>Sale off (%)</Form.Label>
									<Form.Control type="number" placeholder="Enter sale" name="saleOff" value={formik.values.saleOff} onChange={formik.handleChange} isInvalid={formik.touched.saleOff && formik.errors.saleOff} />
									<Form.Control.Feedback type="invalid">{formik.errors.saleOff}</Form.Control.Feedback>
								</Form.Group>
								<Form.Group className="mb-3" controlId="ageGroup">
									<Form.Label>Combo Category</Form.Label>
									<Form.Select name="comboCategory" value={formik.values.comboCategory} onChange={formik.handleChange} isInvalid={formik.touched.comboCategory && formik.errors.comboCategory}>
										<option value="">---Choose Category---</option>
										<option value="Combo for kids">Combo for kids</option>
										<option value="Combo for preschool children">Combo for preschool children</option>
									</Form.Select>
									<Form.Control.Feedback type="invalid">{formik.errors.comboCategory}</Form.Control.Feedback>
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
