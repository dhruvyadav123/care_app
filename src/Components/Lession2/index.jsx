import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';

// import HeaderCard from '../Common/Component/HeaderCard';
import DataTableComponent from './DataTableComponent';

const Lession2List = () => {

  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Lession 2 List" mainTitle="Autism Lession 2" />
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

export default Lession2List;