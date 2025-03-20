import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import AddChild from "../components/AddChild";
import { Button, Card, Col, Container, Form, InputGroup, Row, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import * as Yup from "yup";

function BookingPage() {
	const vaccineAPI = "http://localhost:8080/vaccine";
	const comboAPI = "http://localhost:8080/vaccine/get/comboDetail";
	const userAPI = "http://localhost:8080/users";
	const token = localStorage.getItem("token");
	const decodedToken = token ? jwtDecode(token) : null;

	const navigate = useNavigate();
	const [vaccinesList, setVaccinesList] = useState([]); //List vaccine to show to user
	const [comboList, setComboList] = useState([]); //List combo to show to user
	const [childs, setChilds] = useState([]); //List of user's children

	const [selectedVaccine, setSelectedVaccine] = useState([]); //List of user chosen vaccine
	const [selectedCombo, setSelectedCombo] = useState([]); //List of user chosen combo

	const [bookingError, setBookingError] = useState("");

	const [type, setType] = useState("single");

	const [isOpen, setIsOpen] = useState(false);

	const validation = Yup.object({
		childId: Yup.number().required("Choose your child."),
		vaccinationDate: Yup.date().required("Choose a vaccination date."),
		payment: Yup.string().required("Choose your payment method"),
	});

	const formik = useFormik({
		initialValues: {
			childId: "",
			vaccinationDate: "",
			payment: "credit",
		},
		onSubmit: (values) => {
			handleSubmit(values);
		},
		validationSchema: validation,
	});
	//User must login to use this feature
	useEffect(() => {
		if (!token) {
			navigate("/Login");
			console.log("You must login to use this feature");
			return;
		}
		getChild();
		getVaccines();
		getCombo();
	}, [navigate, token]);

	//Get list of single Vaccine
	const getVaccines = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/get`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				setVaccinesList(data.result);
			} else {
				console.error("Get vaccine error: ", response.status);
			}
		} catch (err) {
			console.error(err);
		}
	};

	//Get list of Combo Vaccine
	const getCombo = async () => {
		try {
			const response = await fetch(`${comboAPI}`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				// console.log(data.result);
				// setComboList(data.result);
				const groupedCombos = groupCombos(data.result);
				setComboList(groupedCombos);
			} else {
				console.error("Get combo error: ", response.status);
			}
		} catch (err) {
			console.error(err);
		}
	};

	//Get account's children
	const getChild = async () => {
		try {
			const accountId = decodedToken.sub;
			const response = await fetch(`${userAPI}/${accountId}/children`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				console.log(data);
				setChilds(data.children);
			} else {
				console.error("Get children failed: ", response.status);
			}
		} catch (err) {
			console.log(err);
		}
	};

	//Get the new child to the top of the list
	const handleChildAdd = (newChild) => {
		if (newChild) {
			setChilds([newChild, ...childs]);
		} else {
			getChild();
		}
	};

	//Group vaccine with the same comboId
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
			grouped[combo.comboId].vaccines.push(combo.vaccineName);
		});
		// Convert grouped object to array
		return Object.values(grouped);
	};

	//Change list depend on type (single or combo)
	const handleTypeChange = (type) => {
		setType(type);
	};

	const handleSubmit = async (values) => {
		// console.log(values);
		if (type === "single" && selectedVaccine.length === 0) {
			setBookingError("Please choose at least 1 vaccine to proceed!");
			return;
		}

		if (type === "combo" && selectedCombo.length === 0) {
			setBookingError("Please choose at least 1 combo to proceed!");
			return;
		}

		createBooking(values);
	};

	// // Create booking first
	const createBooking = async (values) => {
		try {
			const bookingResponse = await fetch(`http://localhost:8080/booking/${values.childId}/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					appointmentDate: values.vaccinationDate,
					status: true,
				}),
			});

			if (!bookingResponse.ok) {
				throw new Error("Failed to create booking");
			}
			const bookingData = await bookingResponse.json();
			console.log(bookingData);
			const bookingId = bookingData.result.bookingId;
			if (bookingId) {
				createOrder(values, bookingId);
			}
			console.log(bookingId);
		} catch (error) {
			setBookingError(error.message);
		}
	};

	//Create order with bookingId
	const createOrder = async (values, bookingId) => {
		try {
			const orderResponse = await fetch(`http://localhost:8080/order/${bookingId}/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					orderDate: new Date().toISOString(),
				}),
			});

			if (!orderResponse.ok) {
				throw new Error("Failed to create order");
			}

			const orderData = await orderResponse.json();
			console.log(orderData);
			const orderId = orderData.result.id;
			if (orderId) {
				addDetail(values, orderId);
			}
			console.log(orderId);
		} catch (error) {
			setBookingError(error.message);
		}
	};

	//Add vaccine detail to order
	//Might move this function to transaction page
	const addDetail = async (values, orderId) => {
		try {
			let success = true;
			if (type === "single") {
				for (const v of selectedVaccine) {
					// const detailData = {
					// 	quantity: v.quantity,
					// 	totalPrice: v.quantity * v.vaccine.salePrice,
					// };
					// console.log(detailData);
					const detailResponse = await fetch(`http://localhost:8080/order/${orderId}/addDetail/${v.vaccine.id}`, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							quantity: v.quantity,
							totalPrice: v.quantity * v.vaccine.salePrice,
						}),
					});
					if (!detailResponse.ok) {
						throw new Error(`Failed to add vaccine ${v.vaccine.id} to orderDetail`);
						success = false;
					}
					//Stop the process if the response throws error
					if (!success) {
						return;
					}
				}
			} else if (type === "combo") {
				// Handle combo vaccines here
				for (const combo of selectedCombo) {
					// Add combo vaccines to order
					// This part needs to be implemented based on your combo structure
					const detailResponse = await fetch(``, {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
						body: JSON.stringify(combo),
					});
					if (!detailResponse.ok) {
						throw new Error(`Failed to add combo ${combo.comboId} to order`);
						success = false;
					}
					if (!success) {
						return;
					}
				}
			}

			const selectedChild = childs.find((child) => child.id === parseInt(values.childId));
			navigate("/Transaction", {
				state: {
					selectedVaccine: selectedVaccine,
					selectedCombo: selectedCombo,
					child: selectedChild,
					vaccinationDate: values.vaccinationDate,
					payment: values.payment,
					type: type,
					orderId: orderId,
				},
			});
		} catch (error) {
			setBookingError(error.message);
		}
	};

	const handleVaccineSelection = (vaccine) => {
		const index = selectedVaccine.findIndex((v) => v.vaccine.id === vaccine.id);
		if (index !== -1) {
			// Vaccine already selected, remove it
			const newSelectedVaccine = [...selectedVaccine];
			newSelectedVaccine.splice(index, 1);
			setSelectedVaccine(newSelectedVaccine);
		} else {
			// Vaccine not selected, add it
			setSelectedVaccine([...selectedVaccine, { vaccine, quantity: 1 }]);
		}
	};

	const handleComboSelection = (combo) => {
		const index = selectedCombo.findIndex((c) => c.comboId === combo.comboId);
		if (index !== -1) {
			const newSelectedCombo = [...selectedCombo];
			newSelectedCombo.splice(index, 1);
			setSelectedCombo(newSelectedCombo);
		} else {
			setSelectedCombo([...selectedCombo, combo]);
		}
	};

	return (
		<>
			<Navigation />
			<Container className="mt-6">
				<h2 className="text-2xl font-bold text-center text-gray-800">Vaccination Booking</h2>
				<br />
				<Form method="POST" onSubmit={formik.handleSubmit} className="bg-white shadow-md rounded-lg p-6">
					<InputGroup className="mb-4 flex items-center gap-4">
						<Form.Select
							aria-label="childId"
							name="childId"
							value={formik.values.childId}
							onChange={formik.handleChange}
							isInvalid={formik.touched.childId && formik.errors.childId}
							className="p-2 border border-gray-300 rounded-md w-full">
							{childs.length > 0 ? (
								<>
									<option>---Choose child---</option>
									{childs.map((child) => (
										<option key={child.id} value={child.id}>
											{child.name}
										</option>
									))}
								</>
							) : (
								<option>No data</option>
							)}
						</Form.Select>
						<Button variant="dark" className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition" onClick={() => setIsOpen(true)}>
							Add child
						</Button>
						<Form.Control.Feedback type="invalid">{formik.errors.childId}</Form.Control.Feedback>
						{isOpen && <AddChild setIsOpen={setIsOpen} open={isOpen} onAdded={handleChildAdd} />}
					</InputGroup>

					<Row>
						<Col md={6}>
							<b className="text-lg font-semibold">Choose vaccine type:</b>
							<ul className="list-none mt-2">
								<li className="mb-2">
									<Form.Check label="Single" name="vaccineType" type="radio" id="single" checked={type === "single"} onChange={() => handleTypeChange("single")} />
								</li>
								<li>
									<Form.Check label="Combo" name="vaccineType" type="radio" id="combo" checked={type === "combo"} onChange={() => handleTypeChange("combo")} />
								</li>
							</ul>

							{/* Single Vaccine Selection */}
							{type === "single" && (
								<div className="mt-4">
									<b className="text-lg font-semibold">Choose vaccines:</b>
									{vaccinesList.length > 0 ? (
										<Table hover className="border rounded-lg overflow-hidden mt-2">
											<thead className="bg-gray-200">
												<tr>
													<th className="p-2 text-center"></th>
													<th className="p-2 text-center">Vaccine Name</th>
													<th className="p-2 text-center">Price ($)</th>
												</tr>
											</thead>
											<tbody>
												{vaccinesList.map((vaccine) => (
													<tr key={vaccine.id} className="hover:bg-gray-100">
														<td className="text-center">
															<Form.Check checked={selectedVaccine.some((v) => v.vaccine.id === vaccine.id)} onChange={() => handleVaccineSelection(vaccine)} />
														</td>
														<td className="text-center">{vaccine.name}</td>
														<td className="text-center">{vaccine.salePrice}</td>
													</tr>
												))}
											</tbody>
										</Table>
									) : (
										<p className="text-red-500 mt-2">No vaccine data found. Check your network connection.</p>
									)}
								</div>
							)}

							{/* Combo Vaccine Selection */}
							{type === "combo" && (
								<div className="mt-4">
									<b className="text-lg font-semibold">Choose combo:</b>
									{comboList.length > 0 ? (
										<Table hover className="border rounded-lg overflow-hidden mt-2">
											<thead className="bg-gray-200">
												<tr>
													<th className="p-2 text-center"></th>
													<th className="p-2 text-center">Combo Name</th>
													<th className="p-2 text-center">Included Vaccines</th>
													<th className="p-2 text-center">Price ($)</th>
												</tr>
											</thead>
											<tbody>
												{comboList.map((combo) => (
													<tr key={combo.comboId} className="hover:bg-gray-100">
														<td className="text-center">
															<Form.Check checked={selectedCombo.some((c) => c.comboId === combo.comboId)} onChange={() => handleComboSelection(combo)} />
														</td>
														<td className="text-center">{combo.comboName}</td>
														<td className="text-center">
															{combo.vaccines.map((vaccine, index, array) => (
																<div key={index}>
																	{vaccine}
																	{index < array.length - 1 && <br />}
																</div>
															))}
														</td>
														<td className="text-center">{combo.total}</td>
													</tr>
												))}
											</tbody>
										</Table>
									) : (
										<p className="text-red-500 mt-2">No combo data found. Check your network connection.</p>
									)}
								</div>
							)}
						</Col>

						<Col md={6}>
							<b className="text-lg font-semibold">Your order:</b>
							{/* Selected Vaccine */}
							{type === "single" && selectedVaccine.length > 0 && (
								<Table borderless className="mt-2">
									<thead className="bg-gray-200">
										<tr>
											<th>Vaccine Name</th>
											<th>Quantity</th>
										</tr>
									</thead>
									<tbody>
										{selectedVaccine.map((v) => (
											<tr key={v.vaccine.id}>
												<td>{v.vaccine.name}</td>
												<td>{v.quantity}</td>
											</tr>
										))}
									</tbody>
								</Table>
							)}

							{/* Vaccination Date */}
							<Form.Group className="mb-4 mt-4">
								<Form.Label className="font-semibold">Choose vaccination date:</Form.Label>
								<Form.Control
									type="date"
									name="vaccinationDate"
									value={formik.values.vaccinationDate}
									onChange={formik.handleChange}
									className="p-2 border border-gray-300 rounded-md w-full"
									isInvalid={formik.touched.vaccinationDate && formik.errors.vaccinationDate}
								/>
								<Form.Control.Feedback type="invalid">{formik.errors.vaccinationDate}</Form.Control.Feedback>
							</Form.Group>

							{/* Payment Method */}
							<Form.Group className="mb-4">
								<Form.Label className="font-semibold">Choose payment method:</Form.Label>
								<br />
								<Form.Check defaultChecked label="Payment by credit card" name="payment" type="radio" id="credit" value="credit" />
								<Form.Check label="Cash payment at the cashier" name="payment" type="radio" id="cash" value="cash" disabled />
								<Form.Check label="Payment via e-wallets (VNPAY, Momo, etc.)" name="payment" type="radio" id="app" value="app" disabled />
							</Form.Group>

							<Button type="submit" className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
								Proceed
							</Button>
						</Col>
					</Row>
				</Form>
			</Container>
		</>
	);
}

export default BookingPage;
