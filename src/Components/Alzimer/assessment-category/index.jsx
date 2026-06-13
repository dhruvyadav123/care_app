import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import AssessmentCategoryTable from './AssessmentCategoryTable';

const AlzheimerCategory = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Alzheimer" title="Alzheimer Category" mainTitle="Alzheimer Category" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <AssessmentCategoryTable/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AlzheimerCategory;