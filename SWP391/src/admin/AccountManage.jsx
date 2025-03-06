import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import UpdateRole from "../components/UpdateRole";

function AccountManage() {
	const token = localStorage.getItem("token");
	const [accounts, setAccounts] = useState([]);
	const [isUpdateOpen, setIsUpdateOpen] = useState(false);

	const [selectedAccount, setSelectedAccount] = useState("");

	// const accountAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/account";
	const accountAPI = "http://localhost:8080/users/getAllUser";

	useEffect(() => {
		const fetchAccount = async () => {
			const response = await fetch(accountAPI, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				setAccounts(data.result);
			} else {
				console.error();
			}
		};
		fetchAccount();
	}, [accountAPI, token]);

	const handleUpdateClick = (accountId) => {
		setSelectedAccount(accountId);
		setIsUpdateOpen(true);
	};

	// .then((response) => response.json())
	// .then((data) => {
	// 	setAccounts(data.result);
	// })
	// .catch((error) => console.error("Error fetching accounts:", error));
	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col>
					<Container className="py-4">
						<h1 className="mb-4 text-primary">Account Management</h1>
						<hr className="mb-4"></hr>
						<Table striped bordered hover responsive>
							<thead>
								<tr>
									<th>#</th>
									<th>Full Name</th>
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
											<td>
												{user.firstName} {user.lastName}
											</td>
											<td>{user.username}</td>
											<td>{user.gender}</td>
											<td>{user.email}</td>
											<td>{user.phoneNumber}</td>
											<td>{user.address}</td>
											<td>{user.roleName}</td>
											<td>{user.status ? "Active" : "Deactive"}</td>
											<td>
												<Button variant="info" size="sm" className="me-2" onClick={() => handleUpdateClick(user.accountId)}>
													Update
												</Button>
												<Button variant="danger" size="sm" className="me-2">
													Delete
												</Button>
												{isUpdateOpen && <UpdateRole setIsOpen={setIsUpdateOpen} open={isUpdateOpen} userId={selectedAccount} />}
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
