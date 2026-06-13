import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';
import DataTableComponent from './DataTableComponent';
import DataTableComponent1 from './DataTableComponent1';
import DataTableComponent2 from './DataTableComponent2';

import HeaderCard from '../Common/Component/HeaderCard';

const FitnessBanners = () => {

  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Home Banner" mainTitle="banner" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              {/* <HeaderCard title="Select Multiple and Delete Single Data" /> */}
              <CardBody>
                <DataTableComponent />
                <hr />
                 <DataTableComponent1 />
                  <hr />
                 <DataTableComponent2 />


              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default FitnessBanners;