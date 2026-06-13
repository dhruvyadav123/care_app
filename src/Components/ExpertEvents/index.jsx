import React, { Fragment } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import DataTableComponent from "./DataTableComponent";

const ExpertEvents = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Events" title="My Events" mainTitle="My Events" />
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

export default ExpertEvents;
