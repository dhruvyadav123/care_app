import React, { Fragment } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Breadcrumbs } from '../../AbstractElements';

// import HeaderCard from '../Common/Component/HeaderCard';
// import DataTableComponent from './DataTableComponent';
import DistancePage  from './DistancePage';
const DistanceList = () => {

  return (
    <Fragment>
      <Breadcrumbs parent="Table" title="Distance " mainTitle="Distance" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                {/* < DataTableComponent/> */}
                <DistancePage/>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );

};

export default DistanceList;