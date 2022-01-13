import React, { useState,useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import axios from 'axios';
// import { useSearchParams } from "react-router-dom";

export default function Home() {
  const [link, setLink] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [inputWidth,setInputWidth]=useState("10ch")
  // const [searchParams] = useSearchParams();
  function copyToClipboard() {
    toast.success("Copied!")
  }

  useEffect(() => {
    axios.defaults.withCredentials = true
    // const name=searchParams.get("name")
    // if(!name) window.location.href="/"
    axios.post(process.env.REACT_APP_BACKEND_URL+"/games").then(resp=>{
      if(resp.data.success){
        setLink(window.location.origin+"/games/"+resp.data.data.link)
      }
      else{
        toast.error("Error::"+resp.data.error)
      }
      setIsLoading(false)
    })
  },[])

  useEffect(()=>{
    setInputWidth(link.length+"ch")
  },[link])

  return (
    <div className="d-flex flex-row align-items-center justify-content-center">
      <div className="card">
      {isLoading && <Loader/>}
        <div>
          <h3>Planning Poker</h3>
          <br />
          <div style={{ marginBottom: '10px' }}>Your personal sharable link</div>
          <div className="d-flex flex-row align-items-center justify-content-center" style={{gap:'10px',marginBottom:'10px'}}>
          <input style={{width:inputWidth}} className="form-control" type="text" id="link_input" value={link} disabled />
          <CopyToClipboard text={link} >
              <button type="button" className="btn btn-primary" onClick={copyToClipboard}>Copy to clipboard</button>
            </CopyToClipboard>
            </div>
            <br/>
          <div className="d-flex flex-row align-items-start">
            <p style={{ fontStyle: 'italic', fontSize: '12px',margin:'0' }} className="fw-light">Note:<br/>1. The first person who visits this link, becomes admin.<br/>2. This link will become invalid after 6 hours.</p>
          </div>
        </div>
      </div>
    </div>
  )
}