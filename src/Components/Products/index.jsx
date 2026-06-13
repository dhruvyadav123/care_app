import React, { Fragment } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import DataTableComponent from "./DataTableComponent";

const Products = () => (
  <Fragment>
    <Breadcrumbs parent="ProductsList" title="Products" mainTitle="Products" />
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

export default Products;
