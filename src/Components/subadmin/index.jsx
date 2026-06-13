import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import DataTableComponent from './DataTableComponents';
import { Breadcrumbs } from '../../AbstractElements';

const AllSubAdmin = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="SubAdmin" mainTitle="SubAdmin Tables" />
      <Container fluid={true}>
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

export default AllSubAdmin;