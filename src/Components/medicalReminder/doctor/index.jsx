import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import DataTables from './dataTable';

const DoctorList = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Doctor" mainTitle="Doctors Table" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <DataTables />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default DoctorList;