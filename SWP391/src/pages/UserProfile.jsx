import React, { useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import SideMenu from "../components/SideMenu";
import UpdateUser from "../components/UpdateUser";

function UserProfile() {
	const token = localStorage.getItem("token");
	const [isOpen, setIsOpen] = useState(false); //use this to open user update form

	return (
		<div>
			<Navigation />
			<br />
			<Container>
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
