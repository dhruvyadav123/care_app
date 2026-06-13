import React, { Fragment, useEffect } from "react";
import { Container, Row, Card, CardBody, Col, Media } from "reactstrap";
import { Breadcrumbs, H4, P, Btn, Image } from "../../../AbstractElements";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersNew } from "../../../Redux/stateSlice/allUsers";
import { fetchVendors } from "../../../Redux/stateSlice/vendorReducer"; // Assuming you have a vendorReducer

import CarToon from "../../../assets/images/dashboard/cartoon.svg";
import Widgets1 from "../../Common/CommonWidgets/Widgets1";
import DashboardStats from "../../../_helper/Card";
const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { pagination } = useSelector((state) => state.allUsers);
  const { vendors } = useSelector((state) => state.vendors); // Assuming you store vendors in the "vendors" state

  // Fetching users and vendors data
  useEffect(() => {
    dispatch(fetchUsersNew());
    dispatch(fetchVendors()); // Fetch vendors data
  }, [dispatch]);

  return (
    <Fragment>
      <Breadcrumbs parent="Dashboard" title="Default" />
      <Container fluid={true}>
        <Row className="widget-grid">
          {/* <Col xxl="4" xl="4" md="6" sm="6" className="box-col-6">
            <Card className="profile-box">
              <CardBody>
                <Media>
                  <Media body>
                    <div className="greeting-user">
                      <H4 attrH4={{ className: "f-w-600" }}>
                        {`Welcome to ${user?.name}`}
                      </H4>
                      <P>Welcome Message</P>
                      <div className="whatsnew-btn">
                        <Btn
                          attrBtn={{
                            color: "transparent",
                            outline: true,
                            className: "btn btn-outline-white",
                          }}
                        >
                          Join Now
                        </Btn>
                      </div>
                    </div>
                  </Media>
                  <div>
                    <div className="clockbox">
                      <svg
                        id="clock"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 600 600"
                      >
                      </svg>
                    </div>
                    <div className="badge f-10 p-0" id="txt" />
                  </div>
                </Media>
                <div className="cartoon">
                  <Image
                    attrImage={{
                      src: CarToon,
                      alt: "vector women with laptop",
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </Col> */}

          {/* <Col xxl="4" xl="3" sm="6" className="box-col-6">
            <Row>
              <Col xl="12">
                <Widgets1
                  data={{
                    title: "No. Of Users",
                    gros: 20,
                    total: pagination?.totalUsers, // This is working fine for users
                    color: "primary",
                    icon: "user",
                    positive: true,
                  }}
                />

                <Widgets1
                  data={{
                    title: "No. Of Vendors",
                    gros: 20,
                    total: vendors?.length ?? "Loading...", // Display total vendors using .length
                    color: "primary",
                    icon: "user",
                    positive: true,
                  }}
                />
              </Col>
            </Row>
          </Col> */}
                        <DashboardStats/>

        </Row>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
