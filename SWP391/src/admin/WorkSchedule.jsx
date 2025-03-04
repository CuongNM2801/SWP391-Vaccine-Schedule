import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

function WorkSchedule() {
	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col>
					<Container className="py-4">
						<h1 className="mb-4 text-primary">Staff Schedule Management</h1>
						<hr className="mb-4"></hr>
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default WorkSchedule;
