import React, { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';

import DataTableComponent from './DataTableComponent';

const Games = () => {
  const location = useLocation();
  const isAlzheimerGames = location.pathname.includes("/alzheimer-games");
  const pageTitle = isAlzheimerGames ? "Alzheimer Games" : "Autism Games";

  return (
    <Fragment>
      <Breadcrumbs
        parent="Games"
        title={pageTitle}
        mainTitle={pageTitle}
      />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              {/* <HeaderCard title="Select Multiple and Delete Single Data" /> */}
              <CardBody>
                <DataTableComponent
                  gameType={isAlzheimerGames ? "alzheimer" : "autism"}
                  title={pageTitle}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default Games;
