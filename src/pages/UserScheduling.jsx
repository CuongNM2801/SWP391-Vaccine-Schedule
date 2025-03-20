import React, { useEffect, useState } from "react";
import { Col, Container, Form, Row, Table } from "react-bootstrap";
import SideMenu from "../components/SideMenu";
import Navigation from "../components/Navbar";
import { jwtDecode } from "jwt-decode";

function UserScheduling() {
	const token = localStorage.getItem("token");
	const decodedToken = jwtDecode(token);
	const userAccountId = decodedToken.sub;
	const bookingAPI = "http://localhost:8080/booking";
	const userAPI = "http://localhost:8080/users";
	const [childList, setChildList] = useState([]);
	const [bookingList, setBookingList] = useState([]);
	const [selectedChild, setSelectedChild] = useState("");

	const getChild = async () => {
		try {
			const response = await fetch(`${userAPI}/${userAccountId}/children`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			if (response.ok) {
				const data = await response.json();
				// console.log(data);
				setChildList(data.children);
				if (data.children.length > 0) {
					setSelectedChild(data.children[0].id);
				}
			} else {
				console.error("Get children failed: ", response.status);
			}
		} catch (err) {
			console.error("SOmething went wrong when fetching child: ", err);
		}
	};

	const getBooking = async () => {
		try {
			const response = await fetch(`${bookingAPI}/all`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const data = await response.json();
				// console.log(data);
				const userBookings = data.filter((booking) => String(booking.child?.account?.accountId) === String(userAccountId));
				// console.log(userBookings);
				setBookingList(userBookings);
			} else {
				console.error("Getting booking failed:", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when getting booking:", err);
		}
	};

	const filterBooking = bookingList.filter((booking) => booking.child.id === selectedChild);

	useEffect(() => {
		getChild();
		getBooking();
	}, []);

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			{console.log(bookingList, childList)}
			<Navigation />
			<br />
			<Container>
				<Row>
					<SideMenu />
					<Col>
						<Row>
							<h2>Booking Schedule:</h2>
						</Row>
						<hr></hr>
						<Container>
							<Row>
								<Col md={7}></Col>
								<Col md={5}>
									<Form.Select value={selectedChild} onChange={(e) => setSelectedChild(Number(e.target.value))}>
										{childList.length > 0 ? (
											childList.map((child) => (
												<option key={child.id} value={child.id}>
													{child.name}
												</option>
											))
										) : (
											<option>No child</option>
										)}
									</Form.Select>
								</Col>
							</Row>
							<Table>
								<thead>
									<tr>
										<th>#</th>
										<th>Vaccination Date</th>
										<th>Status</th>
										<th>Order detail</th>
									</tr>
								</thead>
								<tbody>
									{filterBooking.length > 0 ? (
										filterBooking.map((booking) => (
											<tr key={booking.bookingId}>
												<td>{booking.bookingId}</td>
												<td>{booking.appointmentDate}</td>
												<td>{booking.status ? "Done" : "Not"}</td>
												<td></td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={4}>No booking for this child</td>
										</tr>
									)}
									{/* <tr>
										<td>1</td>
										<td>21-03-2025</td>
										<td>Done</td>
										<td></td>
									</tr> */}
								</tbody>
							</Table>
						</Container>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default UserScheduling;
