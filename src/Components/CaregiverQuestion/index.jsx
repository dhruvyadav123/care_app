import React, { Fragment } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import DataTableComponent from "./DataTableComponent";


const DailyLogQuestion = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Master" title="Caregiver Question" mainTitle="Caregiver Question" />
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

export default DailyLogQuestion;
