import React from "react";
// import axios from "../../axios";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";

class UserInfo extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    const { name, email, age } = this.props.userInfo;

    return (
      <>
        <Button variant="primary" onClick={this.handleShow}>
          Мэдээлэл шинэчлэх
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Мэдээлэл шинэчлэх</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form autoComplete="off" onSubmit={this.props.submitHandler}>
              {/* //! name */}
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Нэр
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={this.props.changeHandler}
                  />
                </Col>
              </Form.Group>
              {/* //! email */}
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Мэйл
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={this.props.changeHandler}
                  />
                </Col>
              </Form.Group>
              {/* //! age */}
              <Form.Group as={Row}>
                <Form.Label column sm={2}>
                  Нас
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="number"
                    name="age"
                    value={age}
                    onChange={this.props.changeHandler}
                  />
                </Col>
              </Form.Group>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.handleClose}>
                  Хаах
                </Button>
                <Button type="submit" onClick={this.handleClose}>
                  Хадгалах
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}
export default UserInfo;
