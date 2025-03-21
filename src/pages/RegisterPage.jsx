import { useFormik } from "formik";
import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";

function RegisterPage() {
	const navigate = useNavigate();
	const accountAPI = "http://localhost:8080/users/register";

	const validation = Yup.object().shape({
		firstName: Yup.string().required("First name is required").min(2, "First name must be at least 2 characters"),
		lastName: Yup.string().required("Last name is required").min(2, "Last name must be at least 2 characters"),
		username: Yup.string().required("Username is required").min(3, "Username must be at least 3 characters").max(50, "Username must be at most 50 characters"),
		password: Yup.string().required("Password is required").min(3, "Password must be at least 2 characters").max(50, "Password must be at most 16 characters"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("password"), null], "Passwords must match")
			.required("Confirm password is required"),
		email: Yup.string()
			.email("Invalid email")
			.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must have a '.' after '@'")
			.required("Email is required")
			.max(50, "Email must be at most 50 characters"),
		phoneNumber: Yup.string()
			.required("Phone number is required")
			.matches(/^0\d+$/, "Phone number must start with 0 and contain only digits")
			.min(10, "Phone number must be at least 10 digits")
			.max(12, "Phone number cannot be longer than 12 digits"),
		address: Yup.string().required("Address is required").min(5, "Address must be at least 5 characters").max(100, "Address must be at most 100 characters"),
	});

	const handleFileChange = (event) => {
		formik.setFieldValue("urlImage", event.currentTarget.files[0]);
	};

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			gender: "MALE",
			username: "",
			password: "",
			confirmPassword: "",
			email: "",
			phoneNumber: "",
			address: "",
			urlImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIFYgpCPMtvHYo7rQ8fFSEgLa1BO78b_9hHA&s",
		},
		onSubmit: (values) => {
			handleRegister(values);
		},
		validationSchema: validation,
	});

	const handleRegister = async (values) => {
		try {
			const { confirmPassword, ...registerValues } = values;
			console.log(registerValues);
			const response = await fetch(accountAPI, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(registerValues),
			});

			if (response.ok) {
				console.log("Registration successful");
				alert("Registration successful!");
				navigate("/login");
			} else {
				console.error("Registration failed:", response.status);
				alert("Registration failed. Please try again.");
			}
		} catch (error) {
			console.error("Registration error:", error);
			alert("An error occurred during registration. Please try again.");
		}
	};

	return (
		<Container className="min-h-screen flex items-center justify-center">
			<div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
				<Link to="/" className="text-blue-500 hover:underline">
					Home
				</Link>
				<h1 className="text-2xl font-bold text-center mb-4">Register</h1>

				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Row className="mb-3">
						<Col>
							<Form.Group controlId="txtFirstname">
								<Form.Label>First Name</Form.Label>
								<Form.Control type="text" placeholder="Enter first name" {...formik.getFieldProps("firstName")} isInvalid={formik.touched.firstName && formik.errors.firstName} />
								<Form.Control.Feedback type="invalid">{formik.errors.firstName}</Form.Control.Feedback>
							</Form.Group>
						</Col>

						<Col>
							<Form.Group controlId="txtLastname">
								<Form.Label>Last Name</Form.Label>
								<Form.Control type="text" placeholder="Enter last name" {...formik.getFieldProps("lastName")} isInvalid={formik.touched.lastName && formik.errors.lastName} />
								<Form.Control.Feedback type="invalid">{formik.errors.lastName}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group className="mb-3">
						<Form.Label>Gender</Form.Label>
						<div className="flex gap-4">
							<Form.Check inline defaultChecked label="Male" name="gender" type="radio" id="Male" value="MALE" onChange={formik.handleChange} />
							<Form.Check inline label="Female" name="gender" type="radio" id="Female" value="FEMALE" onChange={formik.handleChange} />
						</div>
					</Form.Group>

					<Form.Group className="mb-3" controlId="txtUsername">
						<Form.Label>Username</Form.Label>
						<Form.Control type="text" placeholder="Enter username" {...formik.getFieldProps("username")} isInvalid={formik.touched.username && formik.errors.username} />
						<Form.Control.Feedback type="invalid">{formik.errors.username}</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="txtPassword">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" placeholder="Password" {...formik.getFieldProps("password")} isInvalid={formik.touched.password && formik.errors.password} />
						<Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="txtConfirm">
						<Form.Label>Confirm Password</Form.Label>
						<Form.Control type="password" placeholder="Confirm password" {...formik.getFieldProps("confirmPassword")} isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword} />
						<Form.Control.Feedback type="invalid">{formik.errors.confirmPassword}</Form.Control.Feedback>
					</Form.Group>

					<Row className="mb-3">
						<Col>
							<Form.Group controlId="txtEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" placeholder="Enter email" {...formik.getFieldProps("email")} isInvalid={formik.touched.email && formik.errors.email} />
								<Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
							</Form.Group>
						</Col>

						<Col>
							<Form.Group controlId="txtPhone">
								<Form.Label>Phone Number</Form.Label>
								<Form.Control type="tel" placeholder="Enter phone number" {...formik.getFieldProps("phoneNumber")} isInvalid={formik.touched.phoneNumber && formik.errors.phoneNumber} />
								<Form.Control.Feedback type="invalid">{formik.errors.phoneNumber}</Form.Control.Feedback>
							</Form.Group>
						</Col>
					</Row>

					<Form.Group className="mb-3" controlId="txtAddress">
						<Form.Label>Address</Form.Label>
						<Form.Control type="text" placeholder="Enter address" {...formik.getFieldProps("address")} isInvalid={formik.touched.address && formik.errors.address} />
						<Form.Control.Feedback type="invalid">{formik.errors.address}</Form.Control.Feedback>
					</Form.Group>

					<Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-all">
						Register
					</Button>
				</Form>

				<p className="mt-4 text-center">
					Already have an account?{" "}
					<Link to="/Login" className="text-blue-500 hover:underline">
						Login
					</Link>{" "}
					now.
				</p>
			</div>
		</Container>
	);
}

export default RegisterPage;
