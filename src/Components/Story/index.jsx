import React, { Fragment } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { Breadcrumbs } from "../../AbstractElements";
import DataTableComponent from "./DataTableComponent";

const Story = () => {
  return (
    <Fragment>
      <Breadcrumbs parent="Content" title="Story" mainTitle="Story" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <DataTableComponent />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Story;
