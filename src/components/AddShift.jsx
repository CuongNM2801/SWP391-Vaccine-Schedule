import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row, Table, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { TokenUtils } from "../utils/TokenUtils";

function AddShift({ setIsOpen, open, onScheduleAdded }) {
	const navigate = useNavigate();
	const token = TokenUtils.getToken();
	const api = "http://localhost:8080";

	const [staffs, setStaffs] = useState([]);
	const [chosenStaff, setChosenStaff] = useState([]);
	const [staffError, setStaffError] = useState();
	const [apiError, setApiError] = useState("");

	const [repeat, setRepeat] = useState(false);

	// const validation = Yup.object({
	// 	scheduleName: Yup.string().required("Schedule name is required"),
	// 	shiftType: Yup.string().required("Choose a shift type"),
	// 	startDate: Yup.date()
	// 		.transform((currentValue, originalValue) => {
	// 			return originalValue ? new Date(originalValue) : null;
	// 		})
	// 		.nullable()
	// 		.required("Start date is required")
	// 		.min(new Date(new Date().setDate(new Date().getDate())), "Start date cannot be today or before"),
	// 	endDate: Yup.date()
	// 		.transform((currentValue, originalValue) => {
	// 			return originalValue ? new Date(originalValue) : null;
	// 		})
	// 		.nullable()
	// 		.required("End date is required")
	// 		.when("startDate", (startDate, schema) => {
	// 			return schema.test("endDate-after-startDate", "End date cannot be sooner than start date", function (endDate) {
	// 				const { startDate: startDateValue } = this.parent; // Access startDate from form values
	// 				if (!startDateValue || !endDate) {
	// 					return true; // Skip validation if either date is empty
	// 				}
	// 				return new Date(endDate) >= new Date(startDateValue);
	// 			});
	// 		}),
	// });

	const validation = Yup.object({
		scheduleName: Yup.string().required("Schedule name is required"),
		shiftType: Yup.string().required("Choose a shift type"),
		//Bat buoc co startDate, khong duoc chon ngay trong qua khu
		startDate: Yup.date()
			.transform((currentValue, originalValue) => {
				return originalValue ? new Date(originalValue) : null;
			})
			.nullable()
			.required("Start date is required")
			.min(new Date(new Date().setDate(new Date().getDate())), "Start date cannot be today or before"),
		//Bat buoc co endDate, phai sau startDate, cach startDate khong qua 1 nam (tranh viec fetching qua dai)
		endDate: Yup.date()
			.transform((currentValue, originalValue) => {
				return originalValue ? new Date(originalValue) : null;
			})
			.nullable()
			.required("End date is required")
			.when("startDate", (startDate, schema) => {
				return schema
					.test("endDate-after-startDate", "End date cannot be sooner than start date", function (endDate) {
						const { startDate: startDateValue } = this.parent;
						if (!startDateValue || !endDate) {
							return true;
						}
						return new Date(endDate) >= new Date(startDateValue);
					})
					.test("endDate-within-one-year", "End date must be within one year of start date", function (endDate) {
						const { startDate: startDateValue } = this.parent;
						if (!startDateValue || !endDate) {
							return true;
						}
						const oneYearLater = new Date(startDateValue);
						oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);

						return new Date(endDate) <= oneYearLater;
					});
			}),
	});

	const formik = useFormik({
		initialValues: {
			scheduleName: "",
			shiftType: "",
			startDate: "",
			endDate: "",
			repeat: false,
			repeatDays: [],
		},
		onSubmit: (values) => {
			if (chosenStaff.length == 0) {
				setStaffError("Choose at least 1 staff!!!");
				return;
			}
			
			setApiError("");
			handleAddShift(values);
		},
		validationSchema: validation,
	});

	const handleClose = () => setIsOpen(false); //Close modal

	const handleRepeat = (e) => {
		setRepeat(e.target.checked);
		formik.setFieldValue("repeat", e.target.checked);
	};

	//Handle format date error
	const handleStartDateChange = (e) => {
		formik.setFieldValue("startDate", e.target.value);
	};
	const handleEndDateChange = (e) => {
		formik.setFieldValue("endDate", e.target.value);
	};

	//Function handle changing repeat day for formik
	const handleDayChange = (day) => {
		const repeatDays = [...formik.values.repeatDays];
		const index = repeatDays.indexOf(day);
		if (index === -1) {
			repeatDays.push(day);
		} else {
			repeatDays.splice(index, 1);
		}
		formik.setFieldValue("repeatDays", repeatDays);
	};

	//Creating work shift
	const handleAddShift = async (values) => {
		try {
			console.log("Creating schedule with values:", values);
			const startDate = new Date(values.startDate);
			const endDate = new Date(values.endDate);
			
			const response = await fetch(`${api}/working/schedule/create`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
				body: JSON.stringify(values),
			});
			
			if (response.ok) {
				const data = await response.json();
				const schedule = data.result;
				console.log("Schedule created successfully:", schedule);
				alert("Adding shift successful! Now adding staffs to shift");
				await handleAddStaff(schedule);
				
				// Gọi callback để thông báo đã thêm lịch thành công
				if (onScheduleAdded) {
					onScheduleAdded();
				}
				
				handleClose();
			} else {
				const errorData = await response.json().catch(() => ({}));
				console.error("Adding shift error:", response.status, errorData);
				setApiError(`Failed to create schedule: ${errorData.message || response.statusText || "Unknown error"}`);
			}
		} catch (err) {
			console.error("Error creating schedule:", err);
			setApiError(`An error occurred: ${err.message || "Unknown error"}`);
		}
	};

	const handleAddStaff = async (schedule) => {
		try {
			let success = true;
			setApiError("");
			
			if (!schedule || !schedule.workDates) {
				setApiError("No work dates found in schedule");
				return false;
			}
			
			const shift = schedule.workDates;
			console.log("Adding staff to workdates:", shift);
			
			// Sử dụng Promise.all để xử lý tất cả các request cùng lúc
			const promises = [];
			
			for (const day of shift) {
				for (const man of chosenStaff) {
					console.log(`Adding staff ${man.accountId} to work day ${day.id}`);
					
					try {
						const response = await fetch(`${api}/working/detail/${day.id}/${man.accountId}`, {
							method: "POST",
							headers: {
								Authorization: `Bearer ${token}`,
								"Content-type": "application/json",
							},
						});
						
						if (response.ok) {
							console.log(`Successfully added staff ${man.accountId} to day ${day.id}`);
						} else {
							const data = await response.json().catch(() => ({}));
							console.error(`Failed to add staff ${man.accountId} to day ${day.id}:`, data);
							success = false;
							setApiError(`Failed to add staff to workday: ${data.message || response.statusText || "Unknown error"}`);
						}
					} catch (error) {
						console.error("Error adding staff to workday:", error);
						success = false;
						setApiError(`Error adding staff to workday: ${error.message || "Unknown error"}`);
					}
				}
			}
			
			if (success) {
				alert("Adding all staffs to schedule success");
				handleClose();
				return true;
			}
			
			return false;
		} catch (err) {
			console.error("Something went wrong when adding staffs to schedule:", err);
			setApiError(`Error adding staff to schedule: ${err.message || "Unknown error"}`);
			return false;
		}
	};

	//Get all account which have role == STAFF
	const fetchStaff = async () => {
		try {
			const response = await fetch(`${api}/users/getAllUser`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				const staffList = data.result.filter(user => user.roleName === "DOCTOR" || user.roleName === "NURSE");
				setStaffs(staffList);
			} else {
				console.error("Fetching account failed: ", response.status);
				setApiError("Failed to fetch staff list");
			}
		} catch (err) {
			console.error("Something went wrong while fetching accounts: ", err);
			setApiError("Error loading staff list");
		}
	};

	//Get the chosen staffs
	const handleStaffSelection = (staff) => {
		const isSelected = chosenStaff.some((s) => s.accountId === staff.accountId);
		if (isSelected) {
			setChosenStaff(chosenStaff.filter((s) => s.accountId !== staff.accountId));
		} else {
			setChosenStaff([...chosenStaff, staff]);
		}
	};

	useEffect(() => {
		fetchStaff();
	}, []);

	return (
		<div>
			<Modal show={open} onHide={handleClose} size="xl">
				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Add Schedule</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{apiError && (
							<Alert variant="danger" className="mb-3">
								{apiError}
							</Alert>
						)}
						
						<Form.Group className="mb-3" controlId="Shift name">
							<Form.Label>Schedule name</Form.Label>
							<Form.Control
								type="text"
								placeholder="Enter shift name"
								name="scheduleName"
								value={formik.values.scheduleName}
								onChange={formik.handleChange}
								isInvalid={formik.touched.scheduleName && formik.errors.scheduleName}
							/>
							<Form.Control.Feedback type="invalid">{formik.errors.scheduleName}</Form.Control.Feedback>
						</Form.Group>
						<Row>
							<Col>
								<Form.Group className="mb-3" controlId="startDate">
									<Form.Label>Start</Form.Label>
									<Form.Control type="date" name="startDate" value={formik.values.startDate} onChange={handleStartDateChange} isInvalid={formik.touched.startDate && formik.errors.startDate} />
									<Form.Control.Feedback type="invalid">{formik.errors.startDate}</Form.Control.Feedback>
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3" controlId="endDate">
									<Form.Label>End</Form.Label>
									<Form.Control type="date" name="endDate" value={formik.values.endDate} onChange={handleEndDateChange} isInvalid={formik.touched.endDate && formik.errors.endDate} />
									<Form.Control.Feedback type="invalid">{formik.errors.endDate}</Form.Control.Feedback>
									<Form.Text className="text-muted">
										End date must be within one year of start date.
									</Form.Text>
								</Form.Group>
							</Col>
							{/* <Col>
								<Form.Group className="mb-3" controlId="endDate">
									<Form.Label>Start time</Form.Label>
									<Form.Control type="time" />
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3" controlId="endDate">
									<Form.Label>End time</Form.Label>
									<Form.Control type="time" />
								</Form.Group>
							</Col> */}
							<Col>
								<Form.Group className="mb-3">
									<Form.Label>Shift type</Form.Label>
									<Form.Select aria-label="Type" name="shiftType" value={formik.values.shiftType} onChange={formik.handleChange} isInvalid={formik.touched.shiftType && formik.errors.shiftType}>
										<option>---Select---</option>
										<option value="HC">Hanh Chinh</option>
									</Form.Select>
									<Form.Control.Feedback type="invalid">{formik.errors.shiftType}</Form.Control.Feedback>
								</Form.Group>
							</Col>
						</Row>

						<Form.Check type="switch" id="custom-switch" label="Repeat" checked={repeat} onChange={handleRepeat} />
						{repeat && (
							<>
								<Form.Group className="mb-3">
									<Form.Label>Repeat every</Form.Label>
									<Form.Select>
										<option value="week">Week</option>
									</Form.Select>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Repeat on</Form.Label>
									<Row>
										{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
											<Col key={day}>
												<Form.Check type="checkbox" label={day} checked={formik.values.repeatDays.includes(day)} onChange={() => handleDayChange(day)} />
											</Col>
										))}
									</Row>
									{formik.touched.repeatDays && formik.errors.repeatDays && <div className="text-danger">{formik.errors.repeatDays}</div>}
								</Form.Group>
							</>
						)}
						<hr />

						<Row>
							<Col>
								<h3>Choose Staff</h3>
								<Table striped bordered hover responsive>
									<thead>
										<tr>
											<th>#</th>
											<th>Staff ID</th>
											<th>Staff name</th>
											<th>Role</th>
										</tr>
									</thead>
									<tbody>
										{staffs.length > 0 ? (
											staffs.map((staff) => (
												<tr key={staff.accountId}>
													<td>
														<Form.Check checked={chosenStaff.some((s) => s.accountId === staff.accountId)} onChange={() => handleStaffSelection(staff)} />
													</td>
													<td>{staff.accountId}</td>
													<td>{`${staff.firstName} ${staff.lastName}`}</td>
													<td>{staff.roleName}</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan={4} className="text-center">
													No staff available
												</td>
											</tr>
										)}
									</tbody>
								</Table>
							</Col>
							<Col>
								<h3>Chosen Staff:</h3>
								{chosenStaff.length === 0 && staffError && <p className="text-danger">{staffError}</p>}
								<ul>
									{chosenStaff.map((staff) => (
										<li key={staff.accountId}>{`${staff.firstName} ${staff.lastName} (${staff.roleName})`}</li>
									))}
								</ul>
							</Col>
						</Row>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						<Button type="submit" variant="primary">
							Add
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}

export default AddShift;
