import React, { useState, useEffect } from "react";
import { Accordion, Button, Col, Container, Form, Modal, Pagination, Row, Table } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import AddCombo from "../components/AddCombo";

function ComboManage() {
	const [comboList, setComboList] = useState([]);
	const comboAPI = "http://localhost:8080/vaccine/get/comboDetail";
	const [isOpen, setIsOpen] = useState(false);
	const [searchName, setSearchName] = useState("");
	const [searchCategory, setSearchCategory] = useState("");
	const [sortOption, setSortOption] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 4; // Number of items per page

	useEffect(() => {
		getCombo();
	}, []);

	const getCombo = async () => {
		try {
			const response = await fetch(`${comboAPI}`);
			if (response.ok) {
				const data = await response.json();
				const groupedCombos = groupCombos(data.result);
				setComboList(groupedCombos);
			} else {
				console.error("Getting combo list failed: ", response.status);
			}
		} catch (err) {
			console.error("Something went wrong when getting combo list: ", err);
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
					comboCategory: combo.comboCategory,
					saleOff: combo.saleOff,
					total: combo.total,
					vaccines: [], // Initialize vaccines array
				};
			}
			grouped[combo.comboId].vaccines.push({ name: combo.vaccineName, manufacturer: combo.manufacturer, dose: combo.dose });
		});
		// Convert grouped object to array
		return Object.values(grouped);
	};

	const searchCombo = () => {
		let filtered = comboList.filter((combo) => {
			const sName = combo.comboName.toLowerCase().includes(searchName.toLowerCase());
			const sCategory = combo.comboCategory.toLowerCase().includes(searchCategory.toLowerCase());
			return sName && sCategory;
		});
		if (sortOption) {
			filtered = [...filtered].sort((a, b) => {
				if (sortOption === "priceAsc") return a.total - b.total;
				if (sortOption === "priceDes") return b.total - a.total;
			});
		}
		return filtered;
	};

	//Pagination
	const indexOfLastItems = currentPage * itemsPerPage;
	const indexOfFirstItems = indexOfLastItems - itemsPerPage;
	const currentCombos = searchCombo().slice(indexOfFirstItems, indexOfLastItems); //Ensure list not empty
	const totalPages = Math.ceil(searchCombo().length / itemsPerPage);
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

	return (
		<div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
			<Row>
				<Sidebar />
				<Col lg={10}>
					<Container className="py-4">
						<Row className="mb-4 items-center">
							<Col>
								<h1 className="text-primary text-2xl font-bold">Combo Vaccine Management</h1>
							</Col>
							<Col className="text-end">
								<Button variant="primary" onClick={() => setIsOpen(true)}>
									Add New Combo
								</Button>
							</Col>
						</Row>
						{isOpen && <AddCombo setIsOpen={setIsOpen} open={isOpen} />}
						<hr className="mb-4"></hr>

						{/* Search Bar Section */}
						<Container className="bg-gray-100 p-3 rounded-md shadow-sm mb-4">
							<Row className="mb-3 align-items-center">
								<Col md={4}>
									<h4>Search:</h4>
								</Col>
								<Col md={3}>
									<Form.Control type="text" placeholder="Search Combo Name" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="rounded-md" />
								</Col>
								<Col md={3}>
									<Form.Select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)} className="rounded-md">
										<option value="">---Category---</option>
										<option value="kids">Combo for kids</option>
										<option value="preschool">Combo for preschool children</option>
									</Form.Select>
								</Col>
								<Col md={2}>
									<Form.Select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="rounded-md">
										<option value="">---Sort---</option>
										<option value="priceAsc">Price Ascending</option>
										<option value="priceDes">Price Descending</option>
									</Form.Select>
								</Col>
							</Row>
						</Container>

						{/* Table Section */}
						{/* Fuck this part */}
						<div className="overflow-x-auto">
							<table className="w-full border border-gray-400 rounded-lg shadow-md">
								<thead className="rounded-t-lg">
									<tr className="bg-pink-300 text-gray-700">
										<th className="px-4 py-2 border">Id</th>
										<th className="px-4 py-2 border">Combo Name</th>
										<th className="px-4 py-2 border">Included Vaccine</th>
										<th className="px-4 py-2 border">Vaccine Manufacturer</th>
										<th className="px-4 py-2 border">Vaccine Dose</th>
										<th className="px-4 py-2 border">Sale Off</th>
										<th className="px-4 py-2 border">Total Price</th>
										<th className="px-4 py-2 border">Actions</th>
									</tr>
								</thead>

								{currentCombos.length > 0 ? (
									currentCombos.map((combo, comboIndex) => (
										<tbody key={combo.comboId} className={`group border border-gray-800 transition-all duration-200 hover:border-pink-500 hover:border-4 ${comboIndex % 2 === 0 ? "bg-pink-100" : "bg-white"}`}>
											{combo.vaccines.map((vaccine, index) => (
												<tr key={`${combo.comboId}-${index}`} className="group-hover:bg-pink-200 transition-all">
													{index === 0 && (
														<>
															<td rowSpan={combo.vaccines.length} className="px-4 py-2 text-center border font-semibold">
																{combo.comboId}
															</td>
															<td rowSpan={combo.vaccines.length} className="px-4 py-2 font-bold text-gray-700 border">
																{combo.comboName}
															</td>
														</>
													)}
													<td className="px-4 py-2 border">{vaccine.name}</td>
													<td className="px-4 py-2 border">{vaccine.manufacturer}</td>
													<td className="px-4 py-2 border">{vaccine.dose}</td>
													{index === 0 && (
														<>
															<td rowSpan={combo.vaccines.length} className="px-4 py-2 text-center text-green-600 font-semibold border">
																{combo.saleOff}%
															</td>
															<td rowSpan={combo.vaccines.length} className="px-4 py-2 text-center font-bold border">
																${parseFloat(combo.total).toFixed(2)}
															</td>
															<td rowSpan={combo.vaccines.length} className="px-4 py-2 text-center border">
																<button className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-700">Edit</button>
															</td>
														</>
													)}
												</tr>
											))}
										</tbody>
									))
								) : (
									<tbody>
										<tr>
											<td colSpan={8} className="px-4 py-2 text-center border bg-gray-100">
												No Result
											</td>
										</tr>
									</tbody>
								)}
							</table>

							{/* Pagination Centered */}
							<div className="text-center mt-3">{pagination}</div>
						</div>
					</Container>
				</Col>
			</Row>
		</div>
	);
}

export default ComboManage;
