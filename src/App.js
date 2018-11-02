import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import './App.css';

const db = [
  {
    code: 81,
    keyPress: 'Q',
    id: 'kick',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20and%20SINGLE%20HITS/kicks/16[kb]808bd.aif.mp3'
  }, 
  {
    code: 87,
    keyPress: 'W',
    id: 'snare',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20and%20SINGLE%20HITS/snares/57[kb]acoustic_snare.aif.mp3'
  },
  {
    code: 69,
    keyPress: 'E',
    id: 'close-hi',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20and%20SINGLE%20HITS/hats/17[kb]new_closed_hat%202.aif.mp3'
  }, 
  {
    code: 65,
    keyPress: 'A',
    id: 'open-hi',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20and%20SINGLE%20HITS/hats/76[kb]wideopenhh.aif.mp3'
  }, 
  {
    code: 83,
    keyPress: 'S',
    id: 'crash-1',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20and%20SINGLE%20HITS/crashes/92[kb]909-bright-crash.aif.mp3'
  }, 
  {
    code: 68,
    keyPress: 'D',
    id: 'crash-2',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20and%20SINGLE%20HITS/crashes/87[kb]curecrash.aif.mp3'
  }, 
  {
    code: 90,
    keyPress: 'Z',
    id: "tom-1",
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20and%20SINGLE%20HITS/toms/86[kb]loetom.aif.mp3'
  }, 
  {
    code: 88,
    keyPress: 'X',
    id: 'tom-2',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20and%20SINGLE%20HITS/toms/40[kb]midtom2.aif.mp3'
  }, 
  {
    code: 67,
    keyPress: 'C',
    id: 'tom-3',
    url: 'https://sampleswap.org/samples-ghost/DRUMS%20and%20SINGLE%20HITS/toms/86[kb]hietom.aif.mp3'
  }
];

const metronomeClick= "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/kawai%20R50%20drumkit/15[kb]CLICK_3.aif.mp3";



class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      barsToLoop:6,
      looping:false,
      sequence:[],
      lastClicksHolder:[],
      sequenceLoop:[]
    }
    this.playSound=this.playSound.bind(this);
    this.addClick=this.addClick.bind(this);
    this.activateRecording = this.activateRecording.bind(this);
    this.addToSequence=this.addToSequence.bind(this);
    this.playSequence=this.playSequence.bind(this);
    this.startSequence=this.startSequence.bind(this);
    this.timerStop=this.timerStop.bind(this);
  }

  playSound(key){
    let audio;
    if(key==='click') {
      audio = new Audio(metronomeClick);
    }
    else {
     audio = document.getElementById(key);
    }
    audio.currentTime = 0;
    audio.play();
  }

  startSequence(){
    if(this.state.lastClicksHolder.length===this.state.barsToLoop+1) { 
      if(!this.state.looping) {
        this.setState({
        looping:true
      })
      this.index=0;
      this.playSound(this.state.sequenceLoop[0].key);
      this.interval=this.state.sequenceLoop[1].timeStamp - this.state.sequenceLoop[0].timeStamp;
      this.index++;
      this.expected = Date.now() + this.interval;
      setTimeout(this.playSequence, this.interval); //if there are patentheis after this.playSequence it fires immediately ignoring timeout
      }
    }
  }

  timerStop() {
    this.setState({
      looping:false
    })
    clearInterval(this.timerInUse);
    this.timerInUse=0;
  }

  playSequence(){
    this.playSound(this.state.sequenceLoop[this.index].key);
    let dt = Date.now() - this.expected; 

    if (dt < 0) { //disaster ricovery
        dt = 0;
    }
    else if(dt > this.interval){ //disaster ricovery
      this.timerStop();
    }

    if(this.index>this.state.sequenceLoop.length-2){
      this.interval=this.lastStep.timeStamp-this.state.sequenceLoop[this.index].timeStamp;
      this.index=0; //se è l'ultimo deve prendere l'intervallo che c'è con l'elemento 0!!
    }
    else {
      this.interval=this.state.sequenceLoop[this.index+1].timeStamp - this.state.sequenceLoop[this.index].timeStamp;
      this.index++;
    }
    
    this.expected += this.interval;
    this.timerInUse = setTimeout(this.playSequence, this.interval - dt);
  }

  addToSequence(obj){
    let mySequence = [...this.state.sequence];
    mySequence.push(obj);
    this.setState({
      sequence:mySequence
    });
  }

  addClick(timeStamp){
    let myClicks=[...this.state.lastClicksHolder];
    myClicks.push(timeStamp);
    if(myClicks.length>this.state.barsToLoop+1){ //we need 5 metronome clicks for save 4 bars
      myClicks.shift();
    }
    this.setState({
        lastClicksHolder:myClicks
    })
  }

  activateRecording(){
  
    let start=this.state.lastClicksHolder[0];
    let end=this.state.lastClicksHolder[this.state.lastClicksHolder.length-1];
    let sequenceFiltered = this.state.sequence.filter(element => element.timeStamp > start && element.timeStamp < end);
    // crea un nuovo arr toLoop con i click del metronomo mappati
    let toLoop=this.state.lastClicksHolder.map(element => ({timeStamp:element, key:'click'}));
    /*
    //salva l'intervallo tra uno step e l'altro del metronomo
    //this.clickStep = toLoop[1].timeStamp - toLoop[0].timeStamp;
    */
    //salva a parte l'ultimo elemento (il 5o click)
    this.lastStep = toLoop.pop();
    //concatena i tasti premuti
    let loopConcat=toLoop.concat(sequenceFiltered);
    //ordina per date
    loopConcat.sort((a, b) => a.timeStamp - b.timeStamp);


    this.setState({
      recording:true,
      sequenceLoop:loopConcat
    }, () => {
    this.startSequence(); //callback needed because setState is not immediate!
    });

  }

	render(){
		return(
			<div className="app">
				<div id = "drum-machine" className ="box">
					<Drummachine addToSequence={this.addToSequence}/>
					<Metronome addClick={this.addClick}/>
          <Looper barsToLoop={this.state.barsToLoop} timerStop={this.timerStop} activateRecording={this.activateRecording}/>
				</div>
			</div>
		);
	}
}

/* Salva una sequenza di oggetti (tasto premuto, timestamp) 
 * di lunghezza compresa tra il primo e il 4 elemento dell'
 * array lastClicks nello state di Metronome
*/
class Drummachine extends Component {
  constructor(props){
    super(props);
    this.state = {
       display:"",
       volume:0.5
  	}
    this.updateDisplay=this.updateDisplay.bind(this);
    this.updateVolume=this.updateVolume.bind(this);
    
  }

  

  updateVolume(element){
  	this.setState({
  		volume:element.target.value 
  	});
  }

  updateDisplay(data){
  	this.setState({
  		display:data
  	});
  }

  render() {
    return (
        <div className="keypad-container">
        	<div className = "upper-sect">
        		<div className="keypad-screen" id="display"><p className="screen-text">{this.state.display}</p></div>
        	</div>
        	<div className="mid-sect">
        		<AllTiles addToSequence={this.props.addToSequence} volume={this.state.volume} updateDisplay={this.updateDisplay}/>
        	</div>
        	<div className="footer">
        		<div className="slidecontainer">
					<input type="range" min="0" max="1" step="0.01" value={this.state.volume} onChange={this.updateVolume} />
				</div>
        	</div>
      	</div> 
    );
  }
}

class AllTiles extends Component {

  render(){
   let allKeys=db.map((element) => {
    return(
        <SingleTile addToSequence={this.props.addToSequence} volume={this.props.volume} updateDisplay={this.props.updateDisplay} key={element.id} id={element.id} url={element.url} keyPress={element.keyPress} code={element.code}/>
    )
    });
    return(
      <div className="keys-grid">
        {allKeys}
      </div>
    )
  }
}


class SingleTile extends Component {
    constructor(props){
    	super(props);
		this.state = {
    		padStyle: {backgroundColor:'buttonface' }
    	}
    	this.activatePad=this.activatePad.bind(this);
    	this.manageMouse = this.manageMouse.bind(this);
    	this.manageKeyboard = this.manageKeyboard.bind(this);
    	this.playSound = this.playSound.bind(this);
      this.saveSequenceStep = this.saveSequenceStep.bind(this);
    }

    saveSequenceStep(){
      let timeStamp=Date.now();
      let key=this.props.keyPress;
      this.props.addToSequence({timeStamp:timeStamp, key:key});
    }

    activatePad(){  
    this.state.padStyle.backgroundColor === 'orange' ?
    this.setState({
    		padStyle: {backgroundColor:'buttonface'}
    	}) :
    	this.setState({
          	padStyle:  {backgroundColor:'orange', borderStyle: 'inset'}
        });
  	}

    playSound(){
    	let audio = document.getElementById(this.props.keyPress);
    	audio.currentTime = 0;
    	audio.volume=this.props.volume;
    	audio.play();
  	}

  	componentWillMount() { 
  		document.addEventListener('keydown', this.manageKeyboard);
  	}
  
  	componentWillUnmount() {
    	document.removeEventListener('keydown', this.manageKeyboard);
  	}

  	manageKeyboard(key){
    	if (key.keyCode === this.props.code) {
    		this.playSound();
        this.saveSequenceStep();
        	this.props.updateDisplay(this.props.id);
    		this.activatePad();
    		setTimeout(() => this.activatePad(), 100);
    	}
  	}

  	manageMouse(element){
      this.saveSequenceStep();
    	this.props.updateDisplay(this.props.id);
    	this.activatePad();
    	setTimeout(() => this.activatePad(), 100);
    	this.playSound();
  	}

  	render(){
  		return(
      		<button className="drum-pad-button" style={this.state.padStyle} onClick={this.manageMouse}key={this.props.id+"-button"}> 
      			<div className="drum-pad" title={this.props.keyPress}  id={this.props.id}>{this.props.keyPress}
      		 	<audio className='clip' id={this.props.keyPress} src={this.props.url}></audio>
      			</div>
      		</button>
    	)
  	}
}

/* Salva nell'array lastClicks le timestamp degli ultimi this.state.barsToLoop 
 * click del metronomo. 
*/
class Metronome extends Component {
  constructor(props){
    super(props);
    this.state = {
    	display:"",
    	volume:0.5,
    	play:false,
    	beat:60
    }

   	this.step=this.step.bind(this);
   	this.click=this.click.bind(this);
   	this.timerStop=this.timerStop.bind(this);
   	this.timerStart=this.timerStart.bind(this);
    this.updateVolumeMet=this.updateVolumeMet.bind(this);
    this.handleTimer=this.handleTimer.bind(this);
   	this.plusOne=this.plusOne.bind(this);
   	this.plusTen=this.plusTen.bind(this);
   	this.minusOne=this.minusOne.bind(this);
   	this.minusTen=this.minusTen.bind(this);
  }

 
  handleTimer(){
 	this.timerInUse ?
 	this.timerStop():
  	this.timerStart();
  }

 timerStart(){
 	this.setState({
  		play:true
	})
  	this.interval = 6000/this.state.beat*10;
	this.expected = Date.now() + this.interval;
	setTimeout(this.step(), this.interval);
 }

step() { //how to set an accurate timer: https://stackoverflow.com/questions/29971898/how-to-create-an-accurate-timer-in-javascript
    var dt = Date.now() - this.expected; 
   
    if (dt < 0) {
        dt = 0;
    }
    else if(dt > this.interval){
    	this.timerStop();
    }
        
    this.click();
	this.expected += this.interval;
    this.timerInUse = setTimeout(this.step, this.interval - dt);
}

 click() {
    let audio = new Audio(metronomeClick);
    audio.currentTime = 0;
    audio.volume=this.state.volume;
    audio.play();
    this.props.addClick(Date.now());
  };

  timerStop() {
  	this.setState({
  		play:false
	})
  	clearInterval(this.timerInUse);
    this.timerInUse=0;
  }

  plusOne(){
  	this.timerStop();
  	if(this.state.beat+1<221){
  		this.setState({
  	 		beat:this.state.beat+1
  		})
  	}
  }

  minusOne(){
    this.timerStop();
    if(this.state.beat-1>19){
  		this.setState({
  			beat:this.state.beat+Number(-1)
  		})
  	}
  }

  plusTen(){
    this.timerStop();
    if(this.state.beat+10<221){	
  		this.setState({
  	 		beat:this.state.beat+10
  		})
  	}
  }

  minusTen(){
    this.timerStop();
    if(this.state.beat-10>19){
  		this.setState({
  	 		beat:this.state.beat+Number(-10) 
  		})
  	}
  }


  updateVolumeMet(element){
  	this.setState({
  		volume:Number(element.target.value)
  	}); 	
  }



  render(){
    return(
    	<div className = "metronome-container">
    	<div className = "upper-sect">
       		<div className="metronome-screen" id="display-metronome"><p className="screen-text">{this.state.beat}</p></div>
        </div>
        <div className = "mid-sect">
        	<MetronomePad timerStop={this.timerStop} plusOne={this.plusOne} plusTen={this.plusTen} minusOne={this.minusOne} minusTen={this.minusTen}  status={this.state.play} updatePlay={this.handleTimer}/>
       	</div>
       	<div className = "footer">
       	<div className="slidecontainer">
				<input id="metronome-slider" type="range" min="0" max="1" step="0.01" value={this.state.volume} onChange={this.updateVolumeMet} />
			</div>
		</div>
      	</div>
    )
  }
}

class MetronomePad extends Component {
	render(){
		return(
	  	<div className="metronome-controls">
	  		<MetronomeButton adderFunct={this.props.minusTen} timerStop={this.props.timerStop}  status = {this.props.status} id='button-double-left' icon={[faAngleDoubleLeft]}/>
	  		<MetronomeButton adderFunct={this.props.minusOne} timerStop={this.props.timerStop}  status = {this.props.status} id='button-left' icon={[faAngleLeft]}/>
	  		<MetronomeButton adderFunct={this.props.updatePlay} timerStop={this.props.timerStop} status = {this.props.status} id='button-center'icon={[faPlay, faPause]}/>
	  		<MetronomeButton adderFunct={this.props.plusOne} timerStop={this.props.timerStop}   status = {this.props.status} id='button-right' icon={[faAngleRight]}/>
	  		<MetronomeButton adderFunct={this.props.plusTen} timerStop={this.props.timerStop}  status = {this.props.status} id='button-double-right'icon={[faAngleDoubleRight]}/>
        </div>
        )
     };
}

class MetronomeButton extends Component {
	constructor(props){
		super(props);
		this.state = {
			buttonStyle:{backgroundColor:'buttonface' }
		}
		this.assignIcon=this.assignIcon.bind(this);
		this.clickFunct = this.clickFunct.bind(this);
	   	this.buttonPress = this.buttonPress.bind(this);
	}

  buttonPress(){  
    this.state.buttonStyle.backgroundColor === 'orange' ?
    this.setState({
    		buttonStyle: {backgroundColor:'buttonface'}
    	}) :
    	this.setState({
          	buttonStyle:  {backgroundColor:'orange', borderStyle: 'inset'}
        });
  	}


	clickFunct(){
		this.props.adderFunct();
		this.buttonPress();
		setTimeout(() => this.buttonPress(), 100);
	}


	assignIcon(){
	
	return (this.props.icon.length>1) ?
		(this.props.status === false ? this.props.icon[0] : this.props.icon[1])
		:
		this.props.icon[0];

	}

	render(){
		return(
			<button style={this.state.buttonStyle} id={this.props.id} onClick={this.clickFunct}>
               	<FontAwesomeIcon  className="fa-icon" icon={this.assignIcon()}/>
            </button>
		)
	}

}

class Looper extends Component {
  constructor(props){
    super(props);
    this.state = {
      active:false
    };
    this.test=this.test.bind(this);
  }

  test(){
    console.log('yey');
  }

  render(){
return(
  <div className="looperButtons">
    <div className="metronome-screen" id="display-looper"><p className="screen-text">{this.props.barsToLoop}</p></div>
    <button onClick={this.props.activateRecording}>Loop last 4 bars</button>
    <button onClick={this.props.timerStop}>Stop looping</button>
  </div>
  )

  }

}




export default App;
