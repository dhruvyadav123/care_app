import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import DataTableComponent from './DataTableComponent';

const ServiceCategory = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="ProductsList" title="Category" mainTitle="Category Manager" />
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

export default ServiceCategory;
