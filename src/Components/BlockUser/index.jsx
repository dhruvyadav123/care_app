import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';

import DataTableComponent from './DataTableComponent';

const BlockUser = () => {

  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Block Users" mainTitle="Block User" />
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

export default BlockUser;
