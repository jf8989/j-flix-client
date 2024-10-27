import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Accordion,
  Button,
} from "react-bootstrap";
import { Search } from "lucide-react";
import { BackArrow } from "../back-arrow/back-arrow";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./help-center.scss";

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "Getting Started",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "To create an account, click the 'Sign Up' button in the top right corner and follow the registration process. You'll need to provide a valid email address and create a password.",
        },
        {
          question: "What are the subscription options?",
          answer:
            "We offer several subscription tiers including Basic, Standard, and Premium. Each tier offers different features such as HD streaming and number of simultaneous streams.",
        },
      ],
    },
    {
      title: "Account & Billing",
      questions: [
        {
          question: "How do I update my payment information?",
          answer:
            "You can update your payment information by going to your Account Settings and selecting the 'Payment Details' section.",
        },
        {
          question: "How do I cancel my subscription?",
          answer:
            "To cancel your subscription, go to Account Settings, select 'Membership & Billing' and click on 'Cancel Membership'.",
        },
      ],
    },
    {
      title: "Streaming & Content",
      questions: [
        {
          question: "Why isn't a movie or show available?",
          answer:
            "Content availability can vary by region and licensing agreements. Our library is constantly updating with new titles while others may be removed.",
        },
        {
          question: "How do I adjust video quality?",
          answer:
            "Video quality settings can be adjusted in your account settings under 'Playback Settings'.",
        },
      ],
    },
  ];

  const filteredCategories = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="bg-black min-h-screen text-white py-16 content-margin-help">
      <Container>
        <BackArrow className="mb-4" />
        {/* Header Section */}
        <Row className="justify-content-center mb-8">
          <Col md={8} className="text-center">
            <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
            <div className="relative">
              <Form.Control
                type="search"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 bg-gray-800 border-0 rounded-lg"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
            </div>
          </Col>
        </Row>

        {/* Quick Links */}
        <Row className="mb-12">
          <Col xs={12}>
            <h2 className="text-xl font-semibold mb-4">Popular Topics</h2>
          </Col>
          {[
            "Reset Password",
            "Billing Issues",
            "Streaming Problems",
            "Account Security",
          ].map((topic, index) => (
            <Col key={index} sm={6} md={3} className="mb-4">
              <Card className="h-100 bg-gray-800 border-0">
                <Card.Body className="d-flex align-items-center justify-content-center text-center p-4">
                  <Card.Text className="mb-0">{topic}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* FAQ Accordion */}
        <Row className="justify-content-center">
          <Col md={10}>
            <h2 className="text-xl font-semibold mb-4">
              Frequently Asked Questions
            </h2>
            <Accordion>
              {filteredCategories.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="mb-4 bg-gray-800 border-0">
                  <Card.Header className="bg-gray-700">
                    <h3 className="text-lg font-semibold mb-0">
                      {category.title}
                    </h3>
                  </Card.Header>
                  <Card.Body>
                    <Accordion defaultActiveKey="0">
                      {category.questions.map((item, index) => (
                        <Accordion.Item
                          key={index}
                          eventKey={index.toString()}
                          className="bg-transparent border-0 mb-2"
                        >
                          <Accordion.Header className="bg-gray-700 rounded">
                            {item.question}
                          </Accordion.Header>
                          <Accordion.Body className="text-gray-300">
                            {item.answer}
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </Card.Body>
                </Card>
              ))}
            </Accordion>
          </Col>
        </Row>

        {/* Contact Support */}
        <Row className="justify-content-center mt-12">
          <Col md={8} className="text-center">
            <Card className="bg-gray-800 border-0 p-8">
              <Card.Body>
                <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
                <p className="text-gray-300 mb-4">
                  Our support team is available 24/7 to assist you
                </p>
                <Button variant="danger" size="lg">
                  Contact Support
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export { HelpCenter };
