import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import DataTables from './dataTable';
import CommunityDataTableComponent from '../../community/CommunityDataTableComponent';
const EventList = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="event" mainTitle="Event Table" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                {/* <h1>hyy teste</h1> */}

                {/* <DataTables /> */}
                <CommunityDataTableComponent/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default EventList;