import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

function AccountManage() {
	const [accounts, setAccounts] = useState([]);

	// const accountAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/account";
	const accountAPI = "http://localhost:8080/users/getAllUser";

	useEffect(() => {
		fetch(accountAPI)
			.then((response) => response.json())
			.then((data) => {
				setAccounts(data.result);
			})
			.catch((error) => console.error("Error fetching accounts:", error));
	}, []);

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col>
					{console.log(accounts)}
					<Container className="py-4">
						<h1 className="mb-4 text-primary">Account Management</h1>
						<hr className="mb-4"></hr>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>First Name</th>
									<th>Last Name</th>
									<th>Username</th>
									<th>Gender</th>
									<th>Email</th>
									<th>Phone Number</th>
									<th>Address</th>
									<th>Role</th>
									<th>Status</th>
									<th></th>
								</tr>
							</thead>
							<tbody>
								{accounts.length > 0 ? (
									accounts.map((user) => (
										<tr key={user.accountId}>
											<td>{user.accountId}</td>
											<td>{user.firstName}</td>
											<td>{user.lastName}</td>
											<td>{user.username}</td>
											<td>{user.gender}</td>
											<td>{user.email}</td>
											<td>{user.phoneNumber}</td>
											<td>{user.address}</td>
											<td>{user.roleName}</td>
											<td>{user.status}</td>
											<td>
												<Button variant="info" size="sm" className="me-2">
													Update
												</Button>
												<Button variant="danger" size="sm" className="me-2">
													Delete
												</Button>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={11} className="text-center">
											No data
										</td>
									</tr>
								)}
							</tbody>
						</Table>
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default AccountManage;
