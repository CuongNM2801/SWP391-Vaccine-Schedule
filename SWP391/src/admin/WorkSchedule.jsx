import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Sidebar from "../components/Sidebar";

function WorkSchedule() {
	return (
		<Container>
			<Row>
				<Sidebar />
				<Col>
					<Container>
						<h1>Staff Working Schedule</h1>
						<hr></hr>
					</Container>
				</Col>
			</Row>
		</Container>
	);
}

export default WorkSchedule;
