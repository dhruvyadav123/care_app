import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../../AbstractElements';
import VideoList from './VideoList';

const VideosList = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Alzheimer" title="Assessment" mainTitle="Assessment Table" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                < VideosList/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default VideosList;