import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";
import UpdateUser from "../components/UpdateUser";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function UserProfile() {
	const userAPI = "http://localhost:8080/users";

	const token = localStorage.getItem("token");
	const [username, setUsername] = useState("");
	const [userId, setUserId] = useState("");
	const [isOpen, setIsOpen] = useState(false); //use this to open user update form
	const navigate = useNavigate();

	useEffect(() => {
		if (token) {
			const decodedToken = jwtDecode(token);
			setUsername(decodedToken.username);
			setUserId(decodedToken.sub);
		} else {
			navigate("/");
		}
	}, [navigate]);

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				{console.log("UserId: ", userId)}
				<Row>
					<SideMenu />
					<Col>
						<h2>User Profile:</h2>
						<hr></hr>
						<Container className="d-flex justify-content-center">
							<Card style={{ width: "18rem" }}>
								<Card.Img variant="top" src="src/alt/notfound.jpg" />
								<ListGroup className="list-group-flush">
									<ListGroup.Item>Fullname: ...</ListGroup.Item>
									<ListGroup.Item>Gender: ...</ListGroup.Item>
									<ListGroup.Item>Email: ...</ListGroup.Item>
									<ListGroup.Item>Phone number: ...</ListGroup.Item>
									<ListGroup.Item>Address: ...</ListGroup.Item>
								</ListGroup>
								<Card.Body>
									<Button
										onClick={() => {
											setIsOpen(true);
										}}>
										Edit profile
									</Button>
									{isOpen && <UpdateUser setIsOpen={setIsOpen} open={isOpen} />}
								</Card.Body>
							</Card>
						</Container>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default UserProfile;
