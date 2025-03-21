import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Button, Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

function VaccineList() {
	// const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const vaccineAPI = "http://localhost:8080/vaccine";
	const [vaccinesList, setVaccinesList] = useState([]);
	const [searchList, setSearchList] = useState([]);

	// Search and Filter States
	const [search, setSearch] = useState("");
	const [manufacturer, setManufacturer] = useState("");
	const [minPrice, setMinPrice] = useState("");
	const [maxPrice, setMaxPrice] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		fetchVaccine();
	}, []);

	const fetchVaccine = async () => {
		try {
			const response = await fetch(`${vaccineAPI}/get`);
			if (response.ok) {
				const data = await response.json();
				setVaccinesList(data.result);
				setSearchList(data.result);
			} else {
				console.error("Fetching vaccines failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when fetching vaccines: ", err);
		}
	};

	const handleSearch = (e) => {
		e.preventDefault();
		let filteredVaccines = vaccinesList;

		// Filter by search name
		if (search) {
			filteredVaccines = filteredVaccines.filter((vaccine) => vaccine.name.toLowerCase().includes(search.toLowerCase()));
		}

		// Filter by manufacturer
		if (manufacturer) {
			filteredVaccines = filteredVaccines.filter((vaccine) => vaccine.manufacturer.toLowerCase().includes(manufacturer.toLowerCase()));
		}

		// Filter by price range
		const min = parseFloat(minPrice);
		const max = parseFloat(maxPrice);

		if (!isNaN(min) && !isNaN(max) && min > max) {
			setError("Min price cannot be greater than max price.");
			return;
		}

		if (!isNaN(min)) {
			filteredVaccines = filteredVaccines.filter((vaccine) => vaccine.salePrice >= min);
		}

		if (!isNaN(max)) {
			filteredVaccines = filteredVaccines.filter((vaccine) => vaccine.salePrice <= max);
		}

		setError("");
		setSearchList(filteredVaccines);
	};

	const handleReset = () => {
		setSearch("");
		setManufacturer("");
		setMinPrice("");
		setMaxPrice("");
		setError("");
		setSearchList(vaccinesList);
	};

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				<h2 className="text-center text-2xl font-bold mb-4">Vaccine List</h2>

				{/* Search Filters Container */}
				<div className="bg-white shadow-md rounded-lg p-4 mb-6">
					<Form onSubmit={handleSearch}>
						<Row className="g-3">
							<InputGroup className="mb-4">
								<Form.Control type="text" placeholder="Vaccine name..." value={search} onChange={(e) => setSearch(e.target.value)} />
								<Button type="submit" variant="outline-primary">
									Search
								</Button>
								<Button type="button" variant="outline-secondary" onClick={handleReset}>
									Reset
								</Button>
							</InputGroup>
						</Row>
						<Row className="g-3">
							<Col md={5}></Col>
							<Col md={3}>
								<Form.Control type="text" placeholder="Manufacturer..." value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} className="border rounded-md p-2 w-full" />
							</Col>

							<Col md={2}>
								<Form.Control type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="border rounded-md p-2 w-full" />
							</Col>

							<Col md={2}>
								<Form.Control type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="border rounded-md p-2 w-full" />
							</Col>
						</Row>
					</Form>
				</div>

				{/* Error Handling */}
				{error && <p className="text-danger text-center">{error}</p>}

				{/* Vaccine List */}
				{vaccinesList.length > 0 ? (
					<Row xs={1} md={2} lg={4} className="g-4">
						{searchList.length > 0 ? (
							searchList.map((vaccine) => (
								<Col key={vaccine.id}>
									<Card className="h-100 shadow-lg rounded-lg overflow-hidden">
										<Card.Img variant="top" src={vaccine.imagineUrl} className="h-52 object-cover" />
										<Card.Body className="d-flex flex-column">
											<Card.Title className="font-bold text-lg">{vaccine.name}</Card.Title>
											<Card.Text className="text-gray-700">Price: {vaccine.salePrice}$</Card.Text>
											<Card.Text className="text-sm text-gray-500">{vaccine.description}</Card.Text>
											<Link to={`/VaccineDetail/${vaccine.id}`} className="mt-3">
												<Button variant="info" className="w-full">
													Detail
												</Button>
											</Link>
										</Card.Body>
									</Card>
								</Col>
							))
						) : (
							<p className="text-center w-full mt-3 text-lg font-semibold text-gray-500">No results found for "{search}"</p>
						)}
					</Row>
				) : (
					<p className="text-center w-full mt-3 text-red-500 font-semibold">No data retrieved. Please check your network connection.</p>
				)}
			</Container>
		</div>
	);
}

export default VaccineList;
