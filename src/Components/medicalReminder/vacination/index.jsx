import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import DataTables from './dataTable';

const VacinationList = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Vacination" mainTitle="Vacination Table" />
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

export default VacinationList;