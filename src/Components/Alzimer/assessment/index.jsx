import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import AssessmentTable from './AssessmentTable';

const AlzheimerQuestions = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Alzheimer" title=" Assessment Questions" mainTitle="Alzheimer Assessment Questions" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <AssessmentTable />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AlzheimerQuestions;