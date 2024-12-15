import React from "react";
import { Row, Col, Container, Alert } from "react-bootstrap";
import { BackArrow } from "../back-arrow/back-arrow";

export const UnderConstructionView = () => {
  return (
    <Container fluid className="p-3 content-margin">
      <Row className="align-items-center mb-4">
        <Col xs="auto">
          <BackArrow className="mt-1" />
        </Col>
        <Col>
          <h2 className="text-white mb-0">Coming Soon</h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Alert variant="info" className="text-center p-5 mt-4">
            <div className="fs-1 mb-3">🚧</div>
            <h3>Page Under Construction</h3>
            <p className="mb-0">
              We're working hard to bring you something amazing. Check back
              soon!
            </p>
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default UnderConstructionView;
