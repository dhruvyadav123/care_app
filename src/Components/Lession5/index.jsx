import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';

// import HeaderCard from '../Common/Component/HeaderCard';
import DataTableComponent from './DataTableComponent';

const Lession5List = () => {

  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Lession 5 List" mainTitle="Autism Lession 5" />
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

export default Lession5List;