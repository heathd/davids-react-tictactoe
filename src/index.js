import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { thisExpression } from '@babel/types';
import classNames from 'classnames';

function Square(props) {
  const btnClass = classNames({
    square: true,
    winning: props.isWinningSquare
  });
  
  return (
    <button 
      className={btnClass} 
      onClick={()=> props.onClick()} 
      >
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {

  isWinningSquare(i) {
    if (this.props.winningLine) {
      return this.props.winningLine.some((winner) => winner === i);
    }
    return false;
  }
  
  renderSquare(i) {
    return <Square
      value={this.props.squares[i]} 
      isWinningSquare={this.isWinningSquare(i)}
      onClick={() => this.props.handleClick(i)} />;
  }
  
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        toPlay: 'X',
      }],
      stepNumber: 0,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const alreadyWon = current.winningLine;

    if (alreadyWon || squares[i]) {
      return;
    }

    squares[i] = current.toPlay;
    const nextPlayer = current.toPlay === 'X' ? 'O' : 'X';
    
    this.setState({
      history: history.concat([{
        squares: squares,
        toPlay: nextPlayer,
        winningLine: calculateWinningLine(squares)
      }]),
      stepNumber: history.length,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winningLine = current.winningLine;

    const moves = history.map((step, move) => {
      const desc = move ? 
        'Go to move #' + move :
        'Go to game start';
        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
    });

    let status;
    if (winningLine) {
      const winner = current.squares[winningLine[0]];
      status = 'Winner: ' + winner;
    } else {
      status = 'Turn ' + (this.state.stepNumber + 1) + ': ' + current.toPlay + ' to play';
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            winningLine={current.winningLine}
            handleClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinningLine(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }


  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
