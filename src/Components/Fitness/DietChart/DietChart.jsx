import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import DataTableComponent from './DataTableComponent';
import { Breadcrumbs } from '../../../AbstractElements';

const DietChart = () => {

  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="DietChart" mainTitle="Diet Chart" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              {/* <HeaderCard title="Select Multiple and Delete Single Data" /> */}
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

export default DietChart;