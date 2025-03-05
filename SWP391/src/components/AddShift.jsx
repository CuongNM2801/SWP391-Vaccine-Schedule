import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";

function AddShift({ setIsOpen, open }) {
	const [repeat, setRepeat] = useState(false);

	const handleClose = () => setIsOpen(false); //Close modal

	const handleRepeat = (e) => setRepeat(e.target.checked);

	return (
		<div>
			<Modal show={open} onHide={handleClose} size="xl">
				<Form method="POST">
					<Modal.Header closeButton>
						<Modal.Title>Create shift</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form.Group className="mb-3" controlId="Shift name">
							<Form.Label>Shift name</Form.Label>
							<Form.Control type="text" placeholder="Enter shift name" />
						</Form.Group>
						<Row>
							<Col>
								<Form.Group className="mb-3" controlId="startDate">
									<Form.Label>Start</Form.Label>
									<Form.Control type="date" />
								</Form.Group>
							</Col>
							<Col>
								<Form.Group className="mb-3" controlId="endDate">
									<Form.Label>End</Form.Label>
									<Form.Control type="date" />
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
										<option value="month">Month</option>
									</Form.Select>
								</Form.Group>
								<Form.Group className="mb-3">
									<Form.Label>Repeat on</Form.Label>
									<Row>
										<Col>
											<Form.Check type="checkbox" label="Mon" id="mon" />
										</Col>
										<Col>
											<Form.Check type="checkbox" label="Tue" id="tue" />
										</Col>
										<Col>
											<Form.Check type="checkbox" label="Wed" id="wed" />
										</Col>
										<Col>
											<Form.Check type="checkbox" label="Thu" id="thu" />
										</Col>
										<Col>
											<Form.Check type="checkbox" label="Fri" id="fri" />
										</Col>
										<Col>
											<Form.Check type="checkbox" label="Sat" id="sat" />
										</Col>
										<Col>
											<Form.Check type="checkbox" label="Sun" id="sun" />
										</Col>
									</Row>
								</Form.Group>
							</>
						)}
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
