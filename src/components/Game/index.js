import React, { useState, useEffect, useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScoreBoard from './ScoreBoard'
import axios from "axios";
import Select from 'react-select'
import makeAnimated from 'react-select/animated';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Loader from '../Loader';

function Game() {
  const { link } = useParams()
  const [name, setName] = useState("");
  const [nameFieldDisabled, setNameFieldDisabled] = useState(true);
  const [editButtonText, setEditButtonText] = useState("Edit")
  const nameInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false)
  const [rootDivLoading, setRootDivLoading] = useState(true)
  const [nameSubmitButtonLoading, setNameSubmitButtonLoading] = useState(false)
  const [game, setGame] = useState({ show:false,Players: [] })
  const [adminOptions, setAdminOptions] = useState([])
  const [selectedAdminOptions, setSelectedAdminOptions] = useState([])
  const animatedComponents = makeAnimated();
  const [socket,setSocket]=useState(null)

  useEffect(() => {
    axios.defaults.withCredentials = true
    axios.get(process.env.REACT_APP_BACKEND_URL + "/games/users/logged-in").then(response => {
      if (response.data.success) {
        setName(response.data.data.name)
        axios.post(process.env.REACT_APP_BACKEND_URL + `/games/${link}/users`, { name: response.data.data.name }).then(resp => {
          setWSConnection(response.data.data.name)
        })
      }
      else if (response.data.errorCode === 401) {
        setShowModal(true)
      }
      else {
        toast.error("Error:" + response.data.error)
      }
    })
    return () => {
      if (socket) socket.close()
    }
  },[]);

  useEffect(() => {
    //setting up players for admin
    let adminOptions = game.Players.map(player => {return { value: player.name, label: player.name, admin: player.admin }})
    setAdminOptions(adminOptions)
    let selectedAdminOptions = []
    selectedAdminOptions = adminOptions.filter(obj => obj.admin)
    setSelectedAdminOptions(selectedAdminOptions)
  }, [game])

  function setWSConnection(name) {
    let socket = io(process.env.REACT_APP_WS_URL);
    setSocket(socket)
    socket.emit("join_room", { link, name })
    socket.on("game_update", (data) => {
      console.log("game_update", data)
      setGame(data)
      setRootDivLoading(false)
    });
  }

  function handleNameFormSubmit(event) {
    setNameSubmitButtonLoading(true)
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    axios.post(process.env.REACT_APP_BACKEND_URL + `/games/${link}/users`, { name: form.name.value }).then(response => {
      setNameSubmitButtonLoading(false)
      if (response.data.success) {
        setName(form.name.value)
        setWSConnection(form.name.value)
        setRootDivLoading(false)
        setShowModal(false)
      }
      else {
        toast.error("Error:" + response.data.error)
      }
    })
  }

  function onEditName(event) {
    const form = event.currentTarget;
    event.preventDefault();
    event.stopPropagation();
    if (editButtonText === "Edit") {
      setNameFieldDisabled(false);
      setEditButtonText("Save");
      setTimeout(() => {
        nameInputRef.current.focus()
      }, 300)
    }
    else {
      setNameFieldDisabled(true);
      setEditButtonText("Edit");
      axios.patch(process.env.REACT_APP_BACKEND_URL + `/games/${link}/users/logged-in`, {
        name: form.name.value
      }).then(response => {
        if (response.data.success) {
          setName(form.name.value)
          toast.success("Saved!")
        }
      })
    }
  }

  function onAdminSelectionChange(selectedOptions) {
    if (selectedOptions.length === 0) {
      toast.info("Atleast one admin is required per game", { autoClose: 4000 })
    }
    else {
      setSelectedAdminOptions(selectedOptions)
      let users = game.Players.map(player => {
        let user = {}
        Object.assign(user, player)
        if (selectedOptions.find(obj => obj.value === player.name)) user.admin = true
        else user.admin=false
        return user
      })

      axios.patch(process.env.REACT_APP_BACKEND_URL + `/games/${link}/users`, { users }).then(response => {
        if (response.data.success) {
        }
        else {
          toast.error("Error:" + response.data.error)
        }
      })
    }
  }

  return (
    <div className="d-flex flex-row align-items-center justify-content-center">
      <div className="d-flex flex-row align-items-start">
        <div style={{ margin: '20px 20px 0 0',maxWidth:'400px' }} className="card d-flex flex-column align-items-start">
        {rootDivLoading && <Loader/>}
          <label className="col-form-label">Your name</label>
          <form onSubmit={onEditName}>
            <div style={{ gap: '10px' }} className="d-flex flex-row justify-content-center align-items-center">
              <input name="name" ref={nameInputRef} type="text" size="30" className="form-control" defaultValue={name} disabled={nameFieldDisabled ? "disabled" : ""} />
              <button className="btn btn-primary" type="submit">{editButtonText}</button>
            </div>
          </form>
          <br />
          {game.Players.find(player => player.name === name)?.admin && <div className="d-flex flex-column" style={{ width: '100%' }}>
            <label className="col-form-label">Select admin(s)</label>
            <Select
              options={adminOptions}
              value={selectedAdminOptions}
              components={animatedComponents}
              onChange={onAdminSelectionChange}
              isMulti />
          </div>}
        </div>
        <ScoreBoard key={socket} socket={socket} link={link} name={name}/>
      </div>
      <Modal show={showModal} size="sm">
        <Modal.Body>
          <div>
            <Form onSubmit={handleNameFormSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Enter your name</Form.Label>
                <Form.Control type="text" name="name" required />
              </Form.Group>
              <div className="d-flex flex-row justify-content-end align-items-end">
                <button className="btn btn-primary" type="submit" disabled={nameSubmitButtonLoading ? 'disabled' : ''}>Proceed</button>
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Game