import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';

import HeaderCard from '../Common/Component/HeaderCard';
import DataTableComponent from './DataTableComponent';

const AlzheimerCategory = () => {

  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Alzheimer Category"lockuser mainTitle="Alzheimer Category" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                < DataTableComponent/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default AlzheimerCategory  ;