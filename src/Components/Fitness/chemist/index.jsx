import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import DataTableComponent from './dataTable';

const VendorChemistList = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Vendor Chemist" mainTitle="Vendor Chemist Tables" />
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

export default VendorChemistList;