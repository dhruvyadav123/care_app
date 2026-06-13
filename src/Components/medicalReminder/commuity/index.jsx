import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import DataTables from './dataTable';
import CommunityDataTableComponent from '../../community/CommunityDataTableComponent';
const CommunityList = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Commuity" mainTitle="Community Table" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
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

export default CommunityList;