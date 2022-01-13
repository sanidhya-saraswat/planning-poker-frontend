import React from "react";
import "../index.css"
import cardBackImg from '../../../../assets/card-back.png'
import ReactCardFlip from 'react-card-flip';
import './index.css'
function PlayerTable(props) {
  return (
    <table>
      <tbody>
        {props.players.map(player =>
          <tr key={player.name} style={{marginBottom:'5px'}}>
            <td><div className={player.score === -1 ? "redName name" : "greenName name"}>{player.name}</div></td>
            <td><ReactCardFlip isFlipped={props.show && player.score !== -1}>
              <div className="playing-card">
                <img className="playing-card-img" src={cardBackImg} alt="card-back-img"></img>
              </div>
              <div className="playing-card playing-card-back d-flex flex-row align-items-center justify-content-center">
                {player.score===-1?"":player.score}
              </div>
            </ReactCardFlip></td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default PlayerTable