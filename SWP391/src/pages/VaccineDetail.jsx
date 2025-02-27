import React, { useEffect, useState } from "react";
import Navigation from "../components/Navbar";
import { Container, Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";

function VaccineDetail() {
	const [vaccine, setVaccine] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const { id } = useParams();

	useEffect(() => {
		const fetchAPI = async () => {
			setLoading(true);
			try {
				const response = await fetch(`${vaccineAPI}/${id}`);
				if (!response.ok) {
					throw new Error(`Error: ${response.status}`);
				}
				const data = await response.json();
				setVaccine(data);
				setLoading(false);
			} catch (err) {
				console.log(err);
				setError(err);
				setLoading(false);
			}
		};
		fetchAPI();
	}, [id]);

	//If something went wrong
	if (error) {
		return (
			<div>
				<Navigation />
				<br />
				<Container>
					{console.log(error)}
					<h2>Error Loading Vaccine Details</h2>
					<p>{error.message}</p>
				</Container>
			</div>
		);
	}

	return (
		<div>
			<Navigation />
			<br />
			<Container>
				{console.log(vaccine)}
				{loading ? (
					<>
						<Spinner animation="border" role="status">
							<span className="visually-hidden">Loading...</span>
						</Spinner>
					</>
				) : (
					<>
						<h2>{vaccine.name}</h2> Manufaturer: {vaccine.manufacturer}
						<p>Price: {vaccine.price}$</p>
						<hr></hr>
						<b>Description:</b>
						<br />
						<p>{vaccine.description}</p>
						<b>Dosage:</b>
						<br />
						<p>{vaccine.dosage}</p>
						<b>Description</b>
						<br />
						<p>{vaccine.description}</p>
						<b>Description</b>
						<br />
						<p>{vaccine.description}</p>
					</>
				)}
			</Container>
		</div>
	);
}

export default VaccineDetail;
