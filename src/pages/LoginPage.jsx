import { useFormik } from "formik";
import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
	const navigate = useNavigate();
	const accountAPI = "http://localhost:8080/auth/login";

	const formik = useFormik({
		initialValues: {
			username: "",
			password: "",
		},
		onSubmit: (values) => {
			handleLogin(values);
		},
	});

	const handleLogin = async (values) => {
		const response = await fetch(accountAPI, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(values),
		});

		if (response.ok) {
			const data = await response.json();
			const token = data.result.token;
			localStorage.setItem("token", token);
			console.log("Login successful");
			alert("Login successful!");
			navigate("/");
		} else {
			console.error("Login failed:", response.status);
			alert("Login failed. Please try again.");
		}
	};

	return (
		<Container className="min-h-screen flex items-center justify-center">
			<div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
				<Link to="/" className="text-blue-500 hover:underline">
					Home
				</Link>
				<h1 className="text-2xl font-bold text-center mb-4">Login</h1>

				<Form method="POST" onSubmit={formik.handleSubmit}>
					<Form.Group controlId="txtUsername" className="mb-4">
						<Form.Label className="font-medium">Username</Form.Label>
						<Form.Control type="text" placeholder="Enter username" name="username" value={formik.values.username} onChange={formik.handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
					</Form.Group>

					<Form.Group controlId="txtPassword" className="mb-4">
						<Form.Label className="font-medium">Password</Form.Label>
						<Form.Control type="password" placeholder="Password" name="password" value={formik.values.password} onChange={formik.handleChange} className="border border-gray-300 rounded-md p-2 w-full" />
					</Form.Group>

					<Button variant="primary" type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition">
						Submit
					</Button>
				</Form>

				<div className="flex items-center my-4">
					<hr className="flex-grow border-gray-300" />
					<span className="mx-2 text-gray-500">OR</span>
					<hr className="flex-grow border-gray-300" />
				</div>

				<div className="text-center">
					<p className="text-gray-600">Continue with Google</p>
					<Button disabled className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition">
						Google
					</Button>
				</div>

				<p className="mt-4 text-center text-gray-700">
					New to our website?{" "}
					<Link to="/Register" className="text-blue-500 hover:underline">
						Register
					</Link>{" "}
					now.
				</p>
			</div>
		</Container>
	);
}

export default LoginPage;
