import React, { useEffect, useState } from "react";
import { Badge, Button, Col, Container, Form, Image, Modal, Pagination, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddVaccine from "../components/AddVaccine";

function VaccineManage() {
	// const vaccineAPI = "https://66fe49e22b9aac9c997b30ef.mockapi.io/vaccine";
	const [vaccineList, setVaccineList] = useState([]);
	const vaccineAPI = "http://localhost:8080/vaccine/get";
	const [isOpen, setIsOpen] = useState(false); //Form Add Vaccine
	const [searchName, setSearchName] = useState("");
	const [searchManufacturer, setSearchManufacturer] = useState("");
	const [sortOption, setSortOption] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 6; // Number of items per page

	useEffect(() => {
		getVaccine();
	}, []);

	const getVaccine = async () => {
		try {
			const response = await fetch(vaccineAPI);
			if (response.ok) {
				const data = await response.json();
				setVaccineList(data.result);
			} else {
				console.error("Fetching vaccine failed: ", response.status);
			}
		} catch (err) {
			console.error("Error fetching vaccine: ", err);
		}
	};

	const searchVaccine = () => {
		let filtered = vaccineList.filter((vaccine) => {
			const sName = vaccine.name.toLowerCase().includes(searchName.toLowerCase());
			const sManufacturer = vaccine.manufacturer.toLowerCase().includes(searchManufacturer.toLowerCase());
			return sName && sManufacturer;
		});
		if (sortOption) {
			filtered = [...filtered].sort((a, b) => {
				if (sortOption === "quantityAsc") return a.quantity - b.quantity;
				if (sortOption === "unitPriceAsc") return a.unitPrice - b.unitPrice;
				if (sortOption === "salePriceAsc") return a.salePrice - b.salePrice;
				if (sortOption === "quantityDes") return b.quantity - a.quantity;
				if (sortOption === "unitPriceDes") return b.unitPrice - a.unitPrice;
				if (sortOption === "salePriceDes") return b.salePrice - a.salePrice;
				return 0;
			});
		}
		return filtered;
	};

	//Pagination
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	const currentVaccines = searchVaccine().slice(indexOfFirstItems, indexOfLastItems);
	const totalPages = Math.ceil(searchVaccine().length / itemsPerPage);

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber);
	};

	let items = [];
	for (let number = 1; number <= totalPages; number++) {
		items.push(
			<Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
				{number}
			</Pagination.Item>
		);
	}

	const pagination = (
		<Pagination>
			<Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
			<Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
			{items}
			<Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
			<Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
		</Pagination>
	);

	const handleVaccineAdded = (newVaccine) => {
		if (newVaccine) {
			setVaccineList([newVaccine, ...vaccineList]);
		} else {
			getVaccine();
		}
	};

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col lg={10}>
					<Container className="py-4">
						{/* {console.log(vaccineList, currentVaccines)} */}
						<Row className="mb-4 align-items-center">
							<Col>
								<h1 className="text-primary text-2xl font-bold">Vaccine Management</h1>
							</Col>
							<Col className="text-end">
								<Button variant="primary" onClick={() => setIsOpen(true)}>
									Add New Vaccine
								</Button>
							</Col>
						</Row>
						{isOpen && <AddVaccine setIsOpen={setIsOpen} open={isOpen} onAdded={handleVaccineAdded} />}
						<hr className="mb-4"></hr>

						{/* Search Bar Section */}
						<Container className="bg-gray-100 p-3 rounded-md shadow-sm mb-4">
							<Row className="mb-3 align-items-center">
								<Col md={4}>
									<h4>Search:</h4>
								</Col>
								<Col md={3}>
									<Form.Control type="text" placeholder="Search Vaccine Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="rounded-md" />
								</Col>
								<Col md={3}>
									<Form.Control type="text" placeholder="Search Manufacturer" value={searchManufacturer} onChange={(e) => setSearchManufacturer(e.target.value)} className="rounded-md" />
								</Col>
								<Col md={2}>
									<Form.Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="rounded-md">
										<option value="">---Sort---</option>
										<option value="quantityAsc">Sort by Quantity Ascending</option>
										<option value="quantityDes">Sort by Quantity Descending</option>
										<option value="unitPriceAsc">Sort by Unit Price Ascending</option>
										<option value="unitPriceDes">Sort by Unit Price Descending</option>
										<option value="salePriceAsc">Sort by Sale Price Ascending</option>
										<option value="salePriceDes">Sort by Sale Price Descending</option>
									</Form.Select>
								</Col>
							</Row>
						</Container>

						<div className="bg-white shadow-md rounded-lg p-4">
							<Table responsive className="w-full border border-gray-200 rounded-lg overflow-hidden">
								<thead className="bg-gray-100 text-gray-600 text-sm uppercase">
									<tr>
										<th className="px-4 py-2 text-left">ID</th>
										<th className="px-4 py-2 text-left">Vaccine Name</th>
										<th className="px-4 py-2 text-left">Image</th>
										<th className="px-4 py-2 text-left">Manufacturer</th>
										<th className="px-4 py-2 text-left">Quantity</th>
										<th className="px-4 py-2 text-left">Unit Price ($)</th>
										<th className="px-4 py-2 text-left">Sale Price ($)</th>
										<th className="px-4 py-2 text-left">Status</th>
										<th className="px-4 py-2 text-left">Actions</th>
									</tr>
								</thead>
								<tbody className="text-gray-700">
									{currentVaccines.length > 0 ? (
										currentVaccines.map((vaccine) => (
											<tr key={vaccine.id} className="border-b border-gray-200 hover:bg-gray-50">
												<td className="px-4 py-2">{vaccine.id}</td>
												<td className="px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">{vaccine.name}</td>
												<td className="px-4 py-2">
													<Image src={vaccine.imagineUrl} alt={`${vaccine.name} image`} className="h-12 w-12 object-cover rounded-md" />
												</td>
												<td className="px-4 py-2">{vaccine.manufacturer}</td>
												<td className="px-4 py-2">{vaccine.quantity}</td>
												<td className="px-4 py-2">{vaccine.unitPrice}</td>
												<td className="px-4 py-2">{vaccine.salePrice}</td>
												<td className="px-4 py-2">
													{vaccine.status ? (
														vaccine.quantity > 0 ? (
															<span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">Available</span>
														) : (
															<span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs">Unavailable</span>
														)
													) : (
														<span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs">Disabled</span>
													)}
												</td>
												<td></td>
												{/* <td className="px-4 py-2">
													<button className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600">Update</button>
													<button className="bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600">Delete</button>
												</td> */}
											</tr>
										))
									) : (
										<tr>
											<td colSpan={9} className="text-center py-4">
												No Results
											</td>
										</tr>
									)}
								</tbody>
							</Table>

							{/* Pagination Centered */}
							<div className="flex justify-center mt-4">{pagination}</div>
						</div>
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default VaccineManage;
