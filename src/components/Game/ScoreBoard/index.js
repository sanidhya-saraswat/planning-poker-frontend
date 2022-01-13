// import React, { useState, useEffect, useRef } from "react";
import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";
import "./index.css"
import cardBackImg from '../../../assets/card-back.png'
import ReactCardFlip from 'react-card-flip';
import PlayerTable from "./PlayerTable"
import Loader from '../../Loader';

function ScoreBoard(props) {
  const bets = [1, 2, 3, 5, 8, 13, 21]
  const [playersSection, setPlayersSection] = useState(false)
  const [average, setAverage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [rootDivLoading,setRootDivLoading]=useState(true)
  const [game, setGame] = useState({ show:false,Players: [] })
  const link=props.link
  // const game=props.game
  const name=props.name
  const socket=props.socket

  useEffect(()=>{
    if(socket){
      socket.on("game_update", (data) => {
        console.log("game_update", data)
        setGame(data)
        setRootDivLoading(false)
      });
    }
  },[])


  useEffect(() => {
    let arr1 = [], arr2 = [], arr3 = [], arr4 = []
    game.Players.forEach((player,index) => {
      if (index <= 4) arr1.push(player)
      else if (index <= 9) arr2.push(player)
      else if (index <= 14) arr3.push(player)
      else arr4.push(player)
    })
    setPlayersSection(
      <div className="d-flex flex-row align-items-start justify-content-start" style={{ gap: '20px',width:'100%' }}>
        <PlayerTable players={arr1} show={game.show} />
        {arr2.length > 0 && <PlayerTable players={arr2} show={game.show} />}
        {arr3.length > 0 && <PlayerTable players={arr3} show={game.show} />}
        {arr4.length > 0 && <PlayerTable players={arr4} show={game.show} />}
      </div>
    )
    //calc average
    let sum = 0
    let validPlayersCount = 0
    game.Players.forEach(player => {
      if (player.score !== -1) {
        sum += player.score
        validPlayersCount++;
      }
    })
    setAverage(sum / validPlayersCount)
  },[game])

  function onShow() {
    setIsLoading(true)
    axios.patch(process.env.REACT_APP_BACKEND_URL + "/games/"+link,{
      show:true
    }).then(response => {
      setIsLoading(false)
    })
  }

  function onReset() {
    setIsLoading(true)
    axios.patch(process.env.REACT_APP_BACKEND_URL + "/games/"+link+"/reset").then(resp=>{
        setIsLoading(false)
    })
  }

  function setBetItem(betItem) {
    if (!game.show) {
      setIsLoading(true)
      axios.patch(process.env.REACT_APP_BACKEND_URL + "/games/"+link+"/users/logged-in", {
        score: betItem
      }).then(response => {
        setIsLoading(false)
      })
    }
  }

  return (
    <div className="card" id="root_div">
      {rootDivLoading && <Loader/>}
      <div className="d-flex flex-row justify-content-start align-items-center">
        <h3>Planning Poker&nbsp;&nbsp;</h3>
        {isLoading && <div className="spinner-border text-primary" style={{ width: '1.7rem', height: '1.7rem' }} role="status"></div>}
      </div>
      <br />
      <div className="d-flex flex-row justify-content-between">
        {playersSection}
        {game.show && <div style={{ width: '100%' }} className="d-flex flex-row justify-content-center align-items-center">
          <div className="average-score-text">Average:&nbsp;</div>
          <span className="average-score">{average.toFixed(1)}</span>
        </div>}
      </div>
      <br />
      <div className="d-flex flex-row justify-content-start align-items-end" style={{ gap: '50px' }}>
        <div>
          <div style={{ marginBottom: '10px' }}>Choose your bet</div>
          <div className="d-flex flex-row justify-content-around align-items-center" style={{ gap: '5px' }}>
            {bets.map(betItem =>
              <ReactCardFlip cardZIndex={10} key={betItem} isFlipped={game.Players.find(obj=>obj.name===name)?.score=== betItem}>
                <div style={{ cursor: game.show ? 'default' : 'pointer' }} onClick={() => setBetItem(betItem)} className="point-card point-card-front d-flex flex-row justify-content-around align-items-center"><div>{betItem}</div></div>
                <div className="point-card">
                  <img className="point-card-img" src={cardBackImg} alt="card-back-img"></img>
                </div>
              </ReactCardFlip>)}
          </div>
        </div>
        {game.Players.find(obj=>obj.name===name)?.admin && <div>
          <button id="show_cards_btn" disabled={game.show ? "disabled" : ""} onClick={onShow} className="btn btn-primary">Show Cards</button>
          <button className="btn btn-primary" onClick={onReset}>Reset Game</button>
        </div>}
      </div >
    </div>
  )
}

export default ScoreBoard