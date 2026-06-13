"use client";

import React, { Fragment, useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import { Btn, Spinner } from "../../AbstractElements";
import { Col, Input, Form, FormGroup, Button } from "reactstrap";
import axios from "axios";

const DataTableComponent = () => {
  const [alzheimers, setAlzheimers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("");

  // ✅ Get token safely
  const getToken = useCallback(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }, []);

  // ✅ Fetch Alzheimer data with pagination + filters + sorting
  const fetchAlzheimerData = useCallback(
    async (pageNumber = 1, searchText = "", sortField = "", sortOrder = "") => {
      const token = getToken();
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        setLoading(true);
        
        // Build sort parameter for backend
        let sortParam = "";
        if (sortField && sortOrder) {
          sortParam = sortOrder === "asc" ? sortField : `-${sortField}`;
        }

        const response = await axios.get(
          `https://api.careavatar.com/api/assesment/getAllAlzheimer`,
          {
            params: {
              page: pageNumber,
              limit: perPage,
              search: searchText || "",
              sort: sortParam,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const res = response.data;
        console.log("API Response:", res); // Debug log
        
        if (res.success) {
          setAlzheimers(res.data || []);
          setTotalRows(res.total || 0);
        } else {
          console.error("API Error:", res.message);
          setAlzheimers([]);
          setTotalRows(0);
        }
      } catch (err) {
        console.error("Error fetching Alzheimer data:", err);
        setAlzheimers([]);
        setTotalRows(0);
      } finally {
        setLoading(false);
      }
    },
    [perPage, getToken]
  );

  // ✅ Initial + dependency-based fetch
  useEffect(() => {
    fetchAlzheimerData(page, appliedSearch, sortColumn, sortDirection);
  }, [page, perPage, appliedSearch, sortColumn, sortDirection, fetchAlzheimerData]);

  // ✅ Pagination change handlers
  const handlePageChange = (newPage) => {
    console.log("Page changed to:", newPage);
    setPage(newPage);
  };

  const handlePerRowsChange = (newPerPage, newPage) => {
    console.log("Per page changed to:", newPerPage);
    setPerPage(newPerPage);
    setPage(newPage);
  };

  // ✅ Handle sort
  const handleSort = (column, sortDirection) => {
    console.log("Sorting:", column.selector, sortDirection);
    setSortColumn(column.selector);
    setSortDirection(sortDirection);
    setPage(1); // Reset to first page when sorting
  };

  // ✅ Search Handlers
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const handleClearSearch = () => {
    setSearch("");
    setAppliedSearch("");
    setPage(1);
    setSortColumn("");
    setSortDirection("");
  };

  // ✅ Columns with proper sorting
  const columns = [
    {
      name: "Full Name",
      selector: (row) => row.fullName || "-",
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Age",
      selector: (row) => row.age || "-",
      sortable: true,
      center: true,
    },
    {
      name: "Gender",
      selector: (row) => row.gender || "-",
      sortable: true,
      center: true,
    },
    {
      name: "Location",
      selector: (row) => row.location || "-",
      sortable: true,
      wrap: true,
      center: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phoneNumber || "-",
      sortable: true,
      center: true,
    },
    {
      name: "Type",
      selector: (row) => row.type || "-",
      sortable: true,
      center: true,
    },
    {
      name: "Caregiver",
      selector: (row) =>
        row.careGiver?.length
          ? row.careGiver.map((cg) => cg.name).join(", ")
          : "-",
      sortable: false,
      wrap: true,
      center: true,
    },
  ];

  // ✅ Loader
  if (loading && alzheimers.length === 0) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <div className="loader-box">
          <Spinner attrSpinner={{ className: "loader-5" }} />
        </div>
      </Col>
    );
  }

  return (
    <Fragment>
      {/* 🔍 Search Section */}
      <Form onSubmit={handleSearch} className="mb-3">
        <FormGroup>
          <div className="d-flex gap-3 align-items-center">
            <Input
              type="text"
              placeholder="Search by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: "250px" }}
            />
            <Btn attrBtn={{ color: "primary", type: "submit" }}>Search</Btn>
            {(appliedSearch || sortColumn) && (
              <Button color="secondary" onClick={handleClearSearch}>
                Clear All
              </Button>
            )}
          </div>
        </FormGroup>
      </Form>

      {/* Debug Info */}
      {/* <div className="mb-2 text-muted small">
        Showing {alzheimers.length} of {totalRows} records | Page {page} of {Math.ceil(totalRows / perPage)}
      </div> */}

      {/* 🧠 Alzheimer Data Table */}
      <DataTable
        data={alzheimers}
        columns={columns}
        striped
        highlightOnHover
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationDefaultPage={page}
        paginationPerPage={perPage}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        onSort={handleSort}
        sortServer
        persistTableHead
        progressPending={loading}
        progressComponent={
          <div className="text-center p-3">
            <Spinner attrSpinner={{ className: "loader-5" }} />
          </div>
        }
        noDataComponent={
          <div className="text-center p-4">
            {appliedSearch ? "No records found for your search." : "No data available."}
          </div>
        }
      />
    </Fragment>
  );
};

export default DataTableComponent;