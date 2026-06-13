import React, { Fragment } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import DataTableComponent from "./DataTableComponent";

const OrderStatus = () => (
  <Fragment>
    <Breadcrumbs parent="ProductsList" title="Order Status" mainTitle="Order Status" />
    <Container fluid>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              <DataTableComponent />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  </Fragment>
);

export default OrderStatus;
