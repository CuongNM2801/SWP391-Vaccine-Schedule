import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function ComboList() {
	const comboAPI = "http://localhost:8080/vaccine/get/comboDetail";
	const [comboList, setComboList] = useState([]);

	useEffect(() => {
		getCombo();
	}, []);

	const getCombo = async () => {
		try {
			const response = await fetch(`${comboAPI}`);
			if (response.ok) {
				const data = await response.json();
				const groupedCombos = groupCombos(data.result);
				// console.log(data, groupedCombos);
				setComboList(groupedCombos);
			} else {
				console.error("Fetching combos failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when getting combos: ", err);
		}
	};

	//Group vaccine with the same comboId
	const groupCombos = (combosData) => {
		const grouped = {};
		combosData.forEach((combo) => {
			if (!grouped[combo.comboId]) {
				grouped[combo.comboId] = {
					comboId: combo.comboId,
					comboName: combo.comboName,
					description: combo.description,
					ageGroup: combo.ageGroup,
					saleOff: combo.saleOff,
					vaccines: [], // Initialize vaccines array
				};
			}
			grouped[combo.comboId].vaccines.push(combo.vaccineName);
		});
		// Convert grouped object to array
		return Object.values(grouped);
	};

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				{/* {console.log(comboList)} */}
				<h2>Vaccine combo list:</h2>
				<div>
					<Form>
						<InputGroup className="mb-3">
							<Form.Control placeholder="Vaccine combo name..." aria-label="Combo name" aria-describedby="basic-addon2" />
							<Button variant="outline-secondary" id="button-addon2">
								Search
							</Button>
						</InputGroup>
						<Row>
							<Col md={3}>
								<Form.Select className="rounded-md">
									<option value="">---Category---</option>
									<option value="kids">Combo for kids</option>
									<option value="preschool">Combo for preschool children</option>
								</Form.Select>
							</Col>
							<Col md={2}>
								<Form.Select className="rounded-md">
									<option value="">---Sort---</option>
									<option value="priceAsc">Price Ascending</option>
									<option value="priceDes">Price Descending</option>
								</Form.Select>
							</Col>
						</Row>
					</Form>
				</div>

				<Row xs={1} md={2} lg={4} className="g-4">
					{comboList.map((combo) => (
						<Col key={combo.comboId}>
							<Card>
								<Card.Img variant="top" src={"src/alt/notfound.jpg"} />
								<Card.Body>
									<Card.Title>{combo.comboName}</Card.Title>
									<Card.Text>Include: {combo.vaccines.join(", ")}</Card.Text>
									<Card.Text>
										<b>Description:</b> {combo.description}
									</Card.Text>
									<Link to={`/ComboDetail/${combo.id}`}>
										<Button>Detail</Button>
									</Link>
								</Card.Body>
							</Card>
						</Col>
					))}
				</Row>

				<Row>
					{comboList.length > 0 ? (
						comboList.map((combo) => {
							<div key={combo.comboId}>
								<h5>{combo.comboName}</h5>
								<b>{combo.comboCategory}</b>
								<p>{combo.description}</p>
							</div>;
						})
					) : (
						<>No data</>
					)}
				</Row>
			</Container>
		</div>
	);
}

export default ComboList;
