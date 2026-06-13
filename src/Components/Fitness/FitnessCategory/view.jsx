// import React from "react";
// import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
// import { BASE_URL } from "../../../Config/AppConstant";

// const ViewFitnessCategory = ({ data, viewModal, setViewModal }) => {

//   const labelStyle = {
//     fontWeight: "bold",
//     color: "#6c757d",
//   };

//   const valueStyle = {
//     color: "#495057",
//   };

//   const profileImageStyle = {
//     width: "100px",
//     height: "100px",
//     borderRadius: "50%",
//     objectFit: "cover",
//     border: "2px solid #6c757d",
//   };

//   return (
//     <Modal
//       isOpen={viewModal} 
//       toggle={() => setViewModal(false)}
//       size="md"
//       centered
//     >
//       <ModalHeader
//         style={{ padding: "15px 0px 0px 20px!important" }}
//         toggle={() => setViewModal(false)}
//       >
//         View Fitness Category Details
//       </ModalHeader>
//       <hr />
//       <ModalBody>
//         <Row className="text-center mb-4">
//           <Col>
//             <img
//               src={
//                 `${BASE_URL}/uploads/${data?.categoryIcon}` ||
//                 "https://via.placeholder.com/100"
//               }
//               alt="Category Icon"
//               style={profileImageStyle}
//             />
//           </Col>
//         </Row>

//         <Row className="mb-3">
//           <Col md="6" style={labelStyle}>
//             Name:
//           </Col>
//           <Col md="6" style={valueStyle}>
//             {data?.name || "N/A"}
//           </Col>
//         </Row>
//       </ModalBody>
//     </Modal>
//   );
// };

// export default ViewFitnessCategory;


//  add new design by vikas

import React from "react";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";
import { BASE_URL } from "../../../Config/AppConstant";

const ViewFitnessCategory = ({ data, viewModal, setViewModal }) => {
  const labelStyle = {
    fontWeight: "600",
    color: "#495057",
    fontSize: "15px",
  };

  const valueStyle = {
    color: "#212529",
    fontSize: "15px",
  };

  const profileImageStyle = {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #dee2e6",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
  };

  return (
    <Modal
      isOpen={viewModal}
      toggle={() => setViewModal(false)}
      size="md"
      centered
    >
      {/* Header */}
      <ModalHeader
        className="border-0"
        toggle={() => setViewModal(false)}
        style={{ fontWeight: "600", fontSize: "18px" }}
      >
        Vender Category Details
      </ModalHeader>
      <hr className="mt-0 mb-3" />

      {/* Body */}
      <ModalBody>
        {/* Profile Image */}
        <Row className="text-center mb-4">
          <Col>
            <img
              src={
                data?.categoryIcon
                  ? `${BASE_URL}/uploads/${data?.categoryIcon}`
                  : "https://via.placeholder.com/120"
              }
              alt="Category Icon"
              style={profileImageStyle}
            />
            <h5 className="mt-3 mb-0">{data?.name || "N/A"}</h5>
            <small className="text-muted">Category</small>
          </Col>
        </Row>

        {/* Details */}
        <div
          style={{
            background: "#f8f9fa",
            borderRadius: "8px",
            padding: "15px",
            boxShadow: "inset 0px 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <Row className="mb-2">
            <Col md="6" style={labelStyle}>
              Name:
            </Col>
            <Col md="6" style={valueStyle}>
              {data?.name || "N/A"}
            </Col>
          </Row>
          <Row className="mb-2">
            <Col md="6" style={labelStyle}>
              Icon:
            </Col>
            <Col md="6" style={valueStyle}>
              {data?.categoryIcon || "N/A"}
            </Col>
          </Row>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default ViewFitnessCategory;
