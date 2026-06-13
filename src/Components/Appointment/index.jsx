import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';
import AssessmentTable from './AssessmentTable';
const Appointment = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Appointment" title=" Appointment" mainTitle="Appointment" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <AssessmentTable />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Appointment;