import React, { Fragment } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import DataTableComponent from "./DataTableComponent";

const Experts = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Users" title="Experts" mainTitle="Experts" />
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
};

export default Experts;
