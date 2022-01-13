import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate, createSearchParams } from "react-router-dom";
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { toast } from 'react-toastify';

export default function Home() {
  let navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  function generateLink() {
    axios.defaults.withCredentials = true 
    setIsLoading(true)
    axios.get(process.env.REACT_APP_BACKEND_URL + "/games/users/logged-in").then(response => {
      setIsLoading(false)
      if (response.data.success) {
        redirectToGenerateLinkPage(response.data.data.name)
      }
      else if(response.data.errorCode===401){
        setShowModal(true)
      }
      else{
        toast.error("Error:"+response.data.error)
      }
    })
  }

  function redirectToGenerateLinkPage(name) {
    navigate({ pathname: "/generate", search: `?${createSearchParams({ name })}` })
  }

  function handleNameFormSubmit(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    redirectToGenerateLinkPage(form.name.value)
  }

  return (
    <div className="d-flex flex-row align-items-center justify-content-center">
      <div className="card">
        <h3>Planning Poker</h3>
        <br />
        <button id="visit_btn" type="button" className="btn btn-primary" onClick={generateLink} disabled={isLoading ? 'disabled' : ''}>Generate Link</button>
      </div>

      <Modal show={showModal} size="sm">
        <Modal.Body>
          <div>
            <Form onSubmit={handleNameFormSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Enter your name</Form.Label>
                <Form.Control type="text" name="name" required/>
              </Form.Group>
              <div className="d-flex flex-row justify-content-end align-items-end"><button className="btn btn-primary" type="submit">Proceed</button></div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
