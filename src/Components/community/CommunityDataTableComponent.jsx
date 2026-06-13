// import React, { Fragment, useCallback, useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { Btn, Image, Spinner } from "../../AbstractElements";
// import { Col, FormGroup, Input, Form, Button } from "reactstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCommunity,deleteCommunity } from "../../Redux/stateSlice/community";
// import { BASE_URL } from "../../Config/AppConstant";
// import Switch from "react-switch";
// // import Delete from "../../CommonElements/deleteModal";
// import CommunityDelete from "../../CommonElements/communityDeleteModal";
// import ViewModal from "../Users/ViewModal";

// const CommunityDataTableComponent = () => {
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [toggleDelet, setToggleDelet] = useState(false);
//   const [viewData, setViewData] = useState("");
//   const [viewModal, setViewModal] = useState(false);
//   const [search, setSearch] = useState("");
//   const [isSearch, setIsSearch] = useState(false);
//   const [isDelete, setIsDelete] = useState(false);
//   const [deleteUserId, setDeleteUserId] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage] = useState(10);

//   const dispatch = useDispatch();
//   const { loading, error, communities } = useSelector((state) => state.community);

//   // ✅ Fetch data once
//   useEffect(() => {
//     dispatch(fetchCommunity());
//   }, [dispatch]);

//   // ✅ Normalize communities into array
//   const communityList = Array.isArray(communities)
//     ? communities
//     : Array.isArray(communities?.data)
//     ? communities.data
//     : [];

//   // ✅ Searching filter
//   const filteredData = communityList.filter((item) => {
//     if (!search) return true;
//     return (
//       item.name?.toLowerCase().includes(search.toLowerCase()) ||
//       item.email?.toLowerCase().includes(search.toLowerCase()) ||
//       item.phoneNumber?.toLowerCase().includes(search.toLowerCase())
//     );
//   });

//   // ✅ Pagination slice (client-side)
//   const indexOfLast = currentPage * perPage;
//   const indexOfFirst = indexOfLast - perPage;
//   const currentData = filteredData.slice(indexOfFirst, indexOfLast);
//   const handleRowSelected = useCallback((state) => {
//     setSelectedRows(state.selectedRows);
//   }, []);

//   const handleDelete = (id) => {
//     setDeleteUserId(id);
//     setIsDelete(true);
//   };

// const handleConfirmDelete = async () => {
//   if (!deleteUserId) return;

//   try {
//     // Close modal first
//     setIsDelete(false);
//     setDeleteUserId(null);

//     // Call delete API
//      dispatch(deleteCommunity(deleteUserId));

//     // Refresh list
//     dispatch(fetchCommunity());
//     // Optional: reset selected rows
//     setSelectedRows([]);
//     setToggleDelet((prev) => !prev);
//   } catch (err) {
//     console.error("Delete failed:", err);
//   }
// };



//   const handleView = (data) => {
//     setViewModal(true);
//     setViewData(data);
//   };

//   const handleStatusToggle = (e, id, currentStatus) => {
//     console.log("Status toggle:", id, !currentStatus);
//   };

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setIsSearch(true);
//   };

//   const handleClear = () => {
//     setSearch("");
//     setIsSearch(false);
//   };

//   if (loading) {
//     return (
//       <Col className="vh-100 d-flex align-items-center justify-content-center">
//         <div className="loader-box">
//           <Spinner attrSpinner={{ className: "loader-5" }} />
//         </div>
//       </Col>
//     );
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   const tableColumns = [
//     {
//       name: "Profile",
//       cell: (row) => (
//         <div className="avatar">
//           <Image
//             attrImage={{
//               body: true,
//               className: "img-40 rounded-circle",
//               src: `${BASE_URL}/uploads/${row?.communityLogo}`,
//               alt: "#",
//             }}
//           />
//         </div>
//       ),
//     },
//     { name: "Name", selector: (row) => row.name, sortable: true, center: true },
//     { name: "Type", selector: (row) => row.type, sortable: true, center: true },
//     {
//       name: "Hobbies",
//       selector: (row) =>
//         Array.isArray(row.hobbies)
//           ? row.hobbies.map((hobby) => hobby.name).join(", ")
//           : "",
//       sortable: true,
//       center: true,
//     },
//     { name: "Catagory", selector: (row) => row.category.name, sortable: true, center: true },
//     // {
//     //   name: "Status",
//     //   cell: (row) => (
//     //     <Switch
//     //       onChange={(e) => handleStatusToggle(e, row?._id, row?.status)}
//     //       checked={row?.status === true}
//     //       offColor="#dc3545"
//     //       onColor="#28a745"
//     //       uncheckedIcon={false}
//     //       checkedIcon={false}
//     //       height={20}
//     //       width={40}
//     //     />
//     //   ),
//     // },
//     {
//       name: "Status",
//       selector: (row) => `${row.status}`,
//       sortable: true,
//       // maxWidth: "100px",
//       cell: (row) => <span className="badge badge-light-success">Active</span>,
//     },
//     { name: "Total Mumber", selector: (row) => row.totalMembers, sortable: true, center: true },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <div className="d-flex">
//           {/* <button
//             className="btn btn-light p-1 mx-1"
//             onClick={() => handleView(row)}
//           >
//             <i
//               className="fa fa-eye"
//               style={{ fontSize: "small", color: "#494949" }}
//             ></i>
//           </button> */}
//           <button
//             className="btn btn-light p-1 mx-1"
//             onClick={() => handleDelete(row._id)}
//           >
//             <i
//               className="fa fa-trash-o"
//               style={{ fontSize: "small", color: "#494949" }}
//             ></i>
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Fragment>
//       <Form onSubmit={handleSubmit}>
//         <FormGroup>
//           <div className="d-flex gap-3">
//             <Input
//               type="text"
//               placeholder="Search..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               style={{ width: "250px" }}
//             />
//             <Btn attrBtn={{ color: "primary" }}>Search</Btn>
//             {isSearch && (
//               <Button color="secondary" onClick={handleClear}>
//                 Clear
//               </Button>
//             )}
//           </div>
//         </FormGroup>
//       </Form>

//       <DataTable
//         data={currentData}
//         columns={tableColumns}
//         striped
//         pagination
//         paginationServer={true} 
//         paginationTotalRows={filteredData.length}
//         onChangePage={handlePageChange}
//         paginationDefaultPage={currentPage}
//         selectableRows
//         onSelectedRowsChange={handleRowSelected}
//         clearSelectedRows={toggleDelet}
//       />

//       <ViewModal
//         data={viewData}
//         viewModal={viewModal}
//         setViewModal={setViewModal}
//       />
//         {/* <Delete
//           isDelete={isDelete}
//           setIsDelete={setIsDelete}
//           onDelete={handleConfirmDelete}
//         /> */}
//       <CommunityDelete isDelete={isDelete} setIsDelete={setIsDelete} onDelete={handleConfirmDelete} />
//     </Fragment>
//   );
// };

// export default CommunityDataTableComponent;



// import React, { Fragment, useCallback, useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { Btn, Image, Spinner } from "../../AbstractElements";
// import { Col, FormGroup, Input, Form, Button } from "reactstrap";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCommunity, deleteCommunity } from "../../Redux/stateSlice/community";
// import { BASE_URL } from "../../Config/AppConstant";
// import CommunityDelete from "../../CommonElements/communityDeleteModal";
// import ViewModal from "../Users/ViewModal";

// const CommunityDataTableComponent = () => {
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [toggleDelet, setToggleDelet] = useState(false);
//   const [viewData, setViewData] = useState("");
//   const [viewModal, setViewModal] = useState(false);

//   const [searchInput, setSearchInput] = useState(""); // typing field
//   const [search, setSearch] = useState(""); // applied search
//   const [isSearch, setIsSearch] = useState(false);

//   const [isDelete, setIsDelete] = useState(false);
//   const [deleteUserId, setDeleteUserId] = useState(null);

//   const [currentPage, setCurrentPage] = useState(1);
//   const [perPage] = useState(10);

//   const dispatch = useDispatch();
//   const { loading, error, communities } = useSelector((state) => state.community);

//   // Fetch communities
//   useEffect(() => {
//     dispatch(fetchCommunity());
//   }, [dispatch]);

//   // Normalize data
//   const communityList = Array.isArray(communities)
//     ? communities
//     : Array.isArray(communities?.data)
//     ? communities.data
//     : [];

//   // Apply filter only when search is set
//   const filteredData = communityList.filter((item) => {
//     if (!search) return true;
//     return (
//       item.name?.toLowerCase().includes(search.toLowerCase()) ||
//       item.email?.toLowerCase().includes(search.toLowerCase()) ||
//       item.phoneNumber?.toLowerCase().includes(search.toLowerCase())
//     );
//   });

//   // Pagination slice
//   const indexOfLast = currentPage * perPage;
//   const indexOfFirst = indexOfLast - perPage;
//   const currentData = filteredData.slice(indexOfFirst, indexOfLast);

//   // Row selection
//   const handleRowSelected = useCallback((state) => {
//     setSelectedRows(state.selectedRows);
//   }, []);

//   // Delete modal handling
//   const handleDelete = (id) => {
//     setDeleteUserId(id);
//     setIsDelete(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (!deleteUserId) return;
//     try {
//       setIsDelete(false);
//       setDeleteUserId(null);
//       await dispatch(deleteCommunity(deleteUserId));
//       dispatch(fetchCommunity());
//       setSelectedRows([]);
//       setToggleDelet((prev) => !prev);
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   // Page change
//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//   };

//   // Search handling
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSearch(searchInput); // apply search
//     setIsSearch(true);
//     setCurrentPage(1);
//   };

//   const handleClear = () => {
//     setSearch("");
//     setSearchInput("");
//     setIsSearch(false);
//   };

//   // Loader
//   if (loading) {
//     return (
//       <Col className="vh-100 d-flex align-items-center justify-content-center">
//         <div className="loader-box">
//           <Spinner attrSpinner={{ className: "loader-5" }} />
//         </div>
//       </Col>
//     );
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   // Table columns
//   const tableColumns = [
//     {
//       name: "Profile",
//       cell: (row) => (
//         <div className="avatar">
//           <Image
//             attrImage={{
//               body: true,
//               className: "img-40 rounded-circle",
//               src: `${BASE_URL}/uploads/${row?.communityLogo}`,
//               alt: "#",
//             }}
//           />
//         </div>
//       ),
//     },
//     { name: "Name", selector: (row) => row.name, sortable: true, center: true },
//     { name: "Type", selector: (row) => row.type, sortable: true, center: true },
//     {
//       name: "Hobbies",
//       selector: (row) =>
//         Array.isArray(row.hobbies)
//           ? row.hobbies.map((hobby) => hobby.name).join(", ")
//           : "",
//       sortable: true,
//       center: true,
//     },
//     { name: "Category", selector: (row) => row.category?.name, sortable: true, center: true },
//     {
//       name: "Status",
//       selector: (row) => `${row.status}`,
//       sortable: true,
//       cell: () => <span className="badge badge-light-success">Active</span>,
//     },
//     { name: "Total Members", selector: (row) => row.totalMembers, sortable: true, center: true },
//     {
//       name: "Actions",
//       cell: (row) => (
//         <div className="d-flex">
//           <button
//             className="btn btn-light p-1 mx-1"
//             onClick={() => handleDelete(row._id)}
//           >
//             <i className="fa fa-trash-o" style={{ fontSize: "small", color: "#494949" }}></i>
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <Fragment>
//       {/* Search Form */}
//       <Form onSubmit={handleSubmit}>
//         <FormGroup>
//           <div className="d-flex gap-3">
//             <Input
//               type="text"
//               placeholder="Search..."
//               value={searchInput}
//               onChange={(e) => setSearchInput(e.target.value)}
//               style={{ width: "250px" }}
//             />
//             <Btn attrBtn={{ color: "primary" }}>Search</Btn>
//             {isSearch && (
//               <Button color="secondary" onClick={handleClear}>
//                 Clear
//               </Button>
//             )}
//           </div>
//         </FormGroup>
//       </Form>

//       {/* Data Table */}
//       <DataTable
//         data={currentData}
//         columns={tableColumns}
//         striped
//         pagination
//         paginationServer={true}
//         paginationTotalRows={filteredData.length}
//         onChangePage={handlePageChange}
//         paginationDefaultPage={currentPage}
//         selectableRows
//         onSelectedRowsChange={handleRowSelected}
//         clearSelectedRows={toggleDelet}
//       />

//       {/* Modals */}
//       <ViewModal data={viewData} viewModal={viewModal} setViewModal={setViewModal} />
//       <CommunityDelete
//         isDelete={isDelete}
//         setIsDelete={setIsDelete}
//         onDelete={handleConfirmDelete}
//       />
//     </Fragment>
//   );
// };

// export default CommunityDataTableComponent;
import React, { Fragment, useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Btn, Image, Spinner } from "../../AbstractElements";
import {
  Col,
  FormGroup,
  Input,
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCommunity,
  deleteCommunity,
} from "../../Redux/stateSlice/community";
import { API_URL, BASE_URL } from "../../Config/AppConstant";
import CommunityDelete from "../../CommonElements/communityDeleteModal";
import ViewModal from "../Users/ViewModal";

const CommunityDataTableComponent = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleDelet, setToggleDelet] = useState(false);
  const [viewData, setViewData] = useState("");
  const [viewModal, setViewModal] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isSearch, setIsSearch] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // 🔹 Member modal states
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [communityMembers, setCommunityMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  const dispatch = useDispatch();
  const { loading, error, communities } = useSelector(
    (state) => state.community
  );

  useEffect(() => {
    dispatch(fetchCommunity());
  }, [dispatch]);

  const communityList = Array.isArray(communities)
    ? communities
    : Array.isArray(communities?.data)
    ? communities.data
    : [];

  const filteredData = communityList.filter((item) => {
    if (!search) return true;
    return (
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.email?.toLowerCase().includes(search.toLowerCase()) ||
      item.phoneNumber?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const handleRowSelected = useCallback((state) => {
    setSelectedRows(state.selectedRows);
  }, []);

  const handleDelete = (id) => {
    setDeleteUserId(id);
    setIsDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteUserId) return;
    try {
      setIsDelete(false);
      setDeleteUserId(null);
      await dispatch(deleteCommunity(deleteUserId));
      dispatch(fetchCommunity());
      setSelectedRows([]);
      setToggleDelet((prev) => !prev);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setIsSearch(true);
    setCurrentPage(1);
  };

  const handleClear = () => {
    setSearch("");
    setSearchInput("");
    setIsSearch(false);
  };

  // 🔹 Fetch members and show popup
  const handleRowClick = async (row) => {
    setSelectedCommunityId(row._id);
    setLoadingMembers(true);
    setShowMemberModal(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/communityMembers/${row._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

      const data = await res.json();
      const members = data?.[0]?.community?.members || [];
      setCommunityMembers(members);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoadingMembers(false);
    }
  };

  // 🔹 Loading and error states
  if (loading) {
    return (
      <Col className="vh-100 d-flex align-items-center justify-content-center">
        <div className="loader-box">
          <Spinner attrSpinner={{ className: "loader-5" }} />
        </div>
      </Col>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  // 🔹 Table columns
  const tableColumns = [
    {
      name: "Profile",
      cell: (row) => (
        <div className="avatar">
          <Image
            attrImage={{
              body: true,
              className: "img-40 rounded-circle",
              src: `${BASE_URL}/uploads/${row?.communityLogo}`,
              alt: "#",
            }}
          />
        </div>
      ),
    },
    { name: "Name", selector: (row) => row.name, sortable: true, center: true },
    { name: "Type", selector: (row) => row.type, sortable: true, center: true },
    {
      name: "Hobbies",
      selector: (row) =>
        Array.isArray(row.hobbies)
          ? row.hobbies.map((hobby) => hobby.name).join(", ")
          : "",
      sortable: true,
      center: true,
    },
    {
      name: "Category",
      selector: (row) => row.category?.name,
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      selector: (row) => `${row.status}`,
      sortable: true,
      cell: () => (
        <span className="badge badge-light-success">Active</span>
      ),
    },
    {
      name: "Total Members",
      selector: (row) => row.totalMembers,
      sortable: true,
      center: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button
            className="btn btn-light p-1 mx-1"
            onClick={() => handleDelete(row._id)}
          >
            <i
              className="fa fa-trash-o"
              style={{ fontSize: "small", color: "#494949" }}
            ></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      {/* 🔍 Search */}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <div className="d-flex gap-3">
            <Input
              type="text"
              placeholder="Search..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              style={{ width: "250px" }}
            />
            <Btn attrBtn={{ color: "primary" }}>Search</Btn>
            {isSearch && (
              <Button color="secondary" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </FormGroup>
      </Form>

      {/* 📋 Data Table */}
      <DataTable
        data={currentData}
        columns={tableColumns}
        striped
        pagination
        paginationServer={true}
        paginationTotalRows={filteredData.length}
        onChangePage={handlePageChange}
        paginationDefaultPage={currentPage}
        selectableRows
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleDelet}
        onRowClicked={handleRowClick} // 🔹 Opens member modal
      />

      {/* 🔄 View / Delete Modals */}
      <ViewModal
        data={viewData}
        viewModal={viewModal}
        setViewModal={setViewModal}
      />
      <CommunityDelete
        isDelete={isDelete}
        setIsDelete={setIsDelete}
        onDelete={handleConfirmDelete}
      />

      {/* 👥 Member Popup Modal */}
      <Modal
        isOpen={showMemberModal}
        toggle={() => setShowMemberModal(!showMemberModal)}
        size="lg"
      >
        <ModalHeader toggle={() => setShowMemberModal(false)}>
          Community Members
        </ModalHeader>
        <ModalBody>
          {loadingMembers ? (
            <div className="text-center py-4">
              <Spinner attrSpinner={{ className: "loader-5" }} />
            </div>
          ) : communityMembers.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {communityMembers.map((member, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={`${BASE_URL}/uploads/${member?.avatar}`}
                          alt="Profile"
                          className="rounded-circle"
                          width="40"
                          height="40"
                        />
                      </td>
                      <td>{member?.name || "N/A"}</td>
                      <td>{member?.email || "N/A"}</td>
                      <td>{member?.phoneNumber || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted mb-0">
              No members found.
            </p>
          )}
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default CommunityDataTableComponent;
