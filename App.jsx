import React from 'react';
import _ from 'lodash';

var possibleCombinationSum = function(arr, n) {
    if (arr.indexOf(n) >= 0) { return true; }
    if (arr[0] > n) { return false; }
    if (arr[arr.length - 1] > n) {
      arr.pop();
      return possibleCombinationSum(arr, n);
    }
    var listSize = arr.length, combinationsCount = (1 << listSize)
    for (var i = 1; i < combinationsCount ; i++ ) {
      var combinationSum = 0;
      for (var j=0 ; j < listSize ; j++) {
        if (i & (1 << j)) { combinationSum += arr[j]; }
      }
      if (n === combinationSum) { return true; }
    }
    return false;
  };
  
  const Stars = (props) => {
      //Math.random() gives a random number between 0 and 1
    //When multiplied by 9 gives a number upto 8.99
    //That's why we add 1 to get a number between 1 and 9
    console.log("Re-rendering Stars with props = " + props.numberOfStars);
    let stars = [];
    for (let i=0;i<props.numberOfStars;i++) {
        stars.push(<i key={i} className="fa fa-star"></i>)
    }
    
      return(
        <div className="col-5">
        {stars}
      </div>
    );
  }
  
  const Button = (props) => {
      console.log("Redrawing Button with props:");
      console.log(props);
      let button;
    switch(props.answerIsCorrect) {
        case true:
      button =
          <button className="btn btn-success" onClick={props.acceptAnswer}>
            <i className="fa fa-check"></i>
          </button>
      break;
      case false:
      button = 
          <button className="btn btn-danger">
            <i className="fa fa-times"></i>
          </button>
      break;
      default: 
      button =
          <button className="btn" 
        onClick={props.checkAnswer}
        disabled={props.selectedNumbers.length === 0}>=</button>
      break;
    }
      return(
        <div className="col-2 text-center">
          {button}
        <br /><br />
        <button className="btn btn-sm" style={{color: "orange"}} onClick={props.redraw} disabled={props.redraws === 0}>
            <i className="fa fa-sync"></i> {props.redraws}
        </button>
        <br /><br /><br /><br /><br />
      </div>
    );
  }
  
  const Answer = (props) => {
      return(
        <div className="col-5">
          {props.selectedNumbers.map((number, i)=> 
            <span key={i} onClick={() => props.unselectNumber(number)}>{number}</span>
        )}
      </div>
    );
  }
  
  const Number = (props) => {
  
    const numberClassName = (number) => {
        if (props.usedNumbers.indexOf(number) >= 0) {
            return 'used';
        }
        if (props.selectedNumbers.indexOf(number) >= 0) {
            return 'selected';
        }
    }
  
    //second argument is not inclusive
    //instead of this you can have Numbers.list= _.range(1,10)
    const arrayOfNumbers = _.range(1,10);
        return (
            <div className="card text-center">
                <div>
                    {arrayOfNumbers.map((number,i) =>
                        <span key={i} className={numberClassName(number)} 
                        onClick={() => props.selectNumber(number)}>{number}</span>	
                    )}
                </div>
            </div>
    );
  };
  
  const DoneFrame = (props) => {
      return(
        <div className="text-center"> 
          <br />
          <h2>{props.doneStatus}</h2>
        <button className="btn btn-secondary" onClick={props.resetGame}>Play Again</button>
      </div>
    );
  };
  
  class Game extends React.Component {
  
    //state is used to keep track of numbers selected
    //it is placed in the parent because it must be used by siblings
    static initialState = () => ({
        selectedNumbers: [],	
        randomNumberOfStars: 1 + Math.floor(Math.random()*9),
        answerIsCorrect: null,
        usedNumbers: [],
        redraws: 5,
        doneStatus: null,
    });
    
    state = Game.initialState();
    //pass the clicked number and attach it with the numbers previously selected
    selectNumber = (clickedNumber) => {
        //if the number is already selected then return
        if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
        if(this.state.usedNumbers.indexOf(clickedNumber) >= 0) { return; }
            this.setState(prevState => ({
                answerIsCorrect: null,
                selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
      }));
    };
  
    unselectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
        }));
    };
  
    checkAnswer = () => {
        this.setState(prevState => ({
            answerIsCorrect: prevState.randomNumberOfStars === prevState.selectedNumbers.reduce((acc,n) => acc+n, 0)
        }));
    };
  
    acceptAnswer = () => {
        this.setState(prevState => ({
            usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
            answerIsCorrect: null,
            selectedNumbers: [],
            randomNumberOfStars: 1 + Math.floor(Math.random()*9),
        }),this.updateDoneStatus);
    };
    
    redraw = () => {
        if(this.state.redraws === 0) { return; }
        this.setState(prevState => ({
            randomNumberOfStars: 1 + Math.floor(Math.random()*9),
            answerIsCorrect: null,
            selectedNumbers: [],
            redraws: prevState.redraws - 1,
      }),this.updateDoneStatus);
    }
    
    possibleSolutions = ({randomNumberOfStars,usedNumbers}) => {
        //exclude all the used numbers
        const possibleNumbers = _.range(1,10).filter(number => usedNumbers.indexOf(number) === -1);
        return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
    };
    
    updateDoneStatus = () => {
        this.setState(prevState => {
            if(prevState.usedNumbers.length === 9) {
                return { doneStatus: 'Done. Nice!'};
        }
        if(prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
            return { doneStatus: 'Game Over!'};
        }
      });
    }
    
    resetGame = () => {
        this.setState(Game.initialState());
    }
    
    render() {
        console.log(this.state.randomNumberOfStars);
        return(
            <div className="container" id="bimage">
                <br />
                <h2 id="main">Play Nine</h2>
            <hr />
            <div className="row">
                <Stars numberOfStars={this.state.randomNumberOfStars} />
                <Button selectedNumbers={this.state.selectedNumbers} 
                        checkAnswer = {this.checkAnswer}
                        answerIsCorrect = {this.state.answerIsCorrect}
                        acceptAnswer = {this.acceptAnswer}
                        usedNumbers = {this.state.usedNumbers}
                        redraw = {this.redraw}
                        redraws = {this.state.redraws} />
                <Answer selectedNumbers={this.state.selectedNumbers} 
                        unselectNumber={this.unselectNumber} />
            </div>
                {this.state.doneStatus ?
                    <DoneFrame resetGame={this.resetGame} doneStatus={this.state.doneStatus} /> :
                    <Number selectedNumbers={this.state.selectedNumbers}
                            selectNumber={this.selectNumber}
                            usedNumbers={this.state.usedNumbers}
                    />
                }
            </div>
        );
    }
  }
  
  class App extends React.Component {
    render() {
        return(
            <div>
                <Game />
            </div>
      );
    }
  }
  
export default App;