import React, { Fragment, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, Spinner } from "../../AbstractElements";
import { Col, Input, Form, FormGroup, Button } from "reactstrap";
import alzheimerService from "../../Services/alzheimer";
import { resolveAssetUrl } from "../../Utils/media";

const normalizeQuestions = (response) => {
  const questions =
    response?.data?.data ||
    response?.data?.questions ||
    response?.data?.results ||
    response?.data ||
    response?.questions ||
    response?.results ||
    response ||
    [];

  return Array.isArray(questions) ? questions : [];
};

const resolveQuestionImages = (row) => {
  if (Array.isArray(row?.images) && row.images.length) {
    return row.images;
  }

  if (row?.image && typeof row.image === "object") {
    return Object.values(row.image);
  }

  if (row?.image) {
    return [row.image];
  }

  return [];
};

const AlzheimerQuestionTable = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await alzheimerService.getAllQuestions();
        setQuestions(normalizeQuestions(response));
      } catch (err) {
        console.error("Failed to fetch questions:", err);
        setQuestions([]);
        setError(err?.response?.data?.message || "Question list API failed.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setCurrentPage(page);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearch(true);
    setCurrentPage(1);
  };

  const handleSearchClear = () => {
    setSearchInput("");
    setIsSearch(false);
    setCurrentPage(1);
  };

  const filteredData = isSearch
    ? questions.filter((q) =>
        (q?.question || "").toLowerCase().includes(searchInput.toLowerCase())
      )
    : questions;

  const paginatedData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  const columns = [
    { name: "Index", selector: (row) => row?.index || "-", sortable: true, center: true },
    {
      name: "Category",
      selector: (row) => row?.questionCategory?.name || row?.questionCategory || "-",
      center: true,
    },
    { name: "Question", selector: (row) => row?.question || "-", wrap: true, grow: 2 },
    { name: "Points", selector: (row) => row?.points || 0, center: true },
    {
      name: "Images",
      center: true,
      cell: (row) =>
        resolveQuestionImages(row).length > 0 ? (
          <div className="d-flex flex-wrap gap-2 justify-content-center">
            {resolveQuestionImages(row).map((img, i) => (
              <img
                key={i}
                src={resolveAssetUrl(img) || ""}
                alt="img"
                width="40"
                height="40"
                style={{ borderRadius: "5px", border: "1px solid #ccc", objectFit: "cover" }}
              />
            ))}
          </div>
        ) : (
          <span className="text-muted">No image</span>
        ),
    },
  ];

  if (loading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <Spinner attrSpinner={{ className: "loader-5" }} />
      </Col>
    );
  }

  return (
    <Fragment>
      {error ? <p className="text-danger mb-3">{error}</p> : null}

      <Form onSubmit={handleSearch} className="mb-3">
        <FormGroup>
          <div className="d-flex gap-3">
            <Input
              type="text"
              placeholder="Search by question..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ width: "250px" }}
            />
            <Btn attrBtn={{ color: "primary", type: "submit" }}>Search</Btn>
            {isSearch ? (
              <Button color="secondary" onClick={handleSearchClear}>
                Clear
              </Button>
            ) : null}
          </div>
        </FormGroup>
      </Form>

      <DataTable
        data={paginatedData}
        columns={columns}
        striped
        highlightOnHover
        pagination
        paginationServer
        paginationTotalRows={filteredData.length}
        paginationPerPage={perPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        paginationDefaultPage={currentPage}
        noDataComponent={<div className="text-center p-4">No Alzheimer questions found</div>}
      />
    </Fragment>
  );
};

export default AlzheimerQuestionTable;
