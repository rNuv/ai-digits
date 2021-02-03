import {useState, useEffect} from 'react';
import axios from 'axios';
import './App.css';
import 'fontsource-roboto';
import CanvasDraw from 'react-canvas-draw';
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import CssBaseline from "@material-ui/core/CssBaseline";
import {makeStyles, ThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import { blue, red } from '@material-ui/core/colors';
import Brightness6Icon from '@material-ui/icons/Brightness6';

const useStyles = makeStyles({
  root:{
    flexGrow: 1,
  },
  title:{
    textAlign: 'center',
  },
  subtitle:{
    textAlign: 'center',
  },
  buttonContainer:{
    marginBottom: '20px',
  },
  navHeader:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading:{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
  toggle:{
    marginTop: 10,
  },
  body:{
    width: '60%',
    marginBottom: 20,
  }
})

const DarkTheme = createMuiTheme({
  palette: {
    primary: {
      main: red[500]
    },
    secondary: {
      main: blue[400]
    },
    background: {
      default: '#282c34',
    },
    text: {
      primary: '#fff',
    },
  }
})

const LightTheme = createMuiTheme({
  palette: {
    primary: {
      main: blue[500]
    },
    secondary: {
      main: red[400]
    },
    background: {
      default: '#fff',
    },
    text: {
      primary: '#282c34',
    },
  }
})

function App() {
  const classes = useStyles();
  const[state, setState] = useState({
    onChange: null,
    loadTimeOffset: 0,
    lazyRadius: 5,
    brushRadius: 4,
    brushColor: "#000",
    catenaryColor: "#0a0302",
    hideGrid: true,
    canvasWidth: 275,
    canvasHeight: 275,
    saveData: null,
    hideInterface: true,
    immediateLoading: true,
  });
  const[saveableCanvas, setSaveableCanvas] = useState(null);
  const[imageData, setImageData] = useState("");
  const[response, setResponse] = useState("Loading...");
  const[theme, setTheme] = useState(true);
  const appliedTheme = theme ? LightTheme : DarkTheme;

  useEffect(() => {
    var req = imageData.replaceAll("#", "%35");
    axios.get(`/process_image?image=${req}`)
      .then(res => {
        setResponse(res.data.image_prediction);
    });
  }, [imageData]);

  return (
    <ThemeProvider theme={appliedTheme}>
      <CssBaseline />
      <div className="container">
        <div className={classes.root}>
          <AppBar>
            <ToolBar>
              <Grid justify={"space-between"} container>
                <Grid xs={1} item></Grid>
                <Grid xs={4} item>
                  <Grid container justify={"center"}>
                    <div className={classes.heading}>
                      <Typography variant="h4">
                        AI Digits
                      </Typography>
                      <Typography variant="subtitle1">
                        A rudimentary take on Neural Networks
                      </Typography>
                    </div>
                  </Grid>
                </Grid>
                <Grid xs={1} item>
                  <IconButton
                    onClick={() => setTheme(!theme)}
                    className={classes.toggle}
                  >
                    <Brightness6Icon />
                  </IconButton>
                </Grid>
              </Grid>
              </ToolBar>
          </AppBar>
        </div>    
        <Typography variant="body1" className={classes.body} align="justify">
          For my independent study class in artificial intelligence, I created a 2 layer neural network library from scratch in Python. I decided to turn it into a web application with React and Flask. It's not the greatest model, but it's a decent attempt. As a 28x28 input image, the net has 784 input nodes, 64 hidden nodes and 10 output nodes. The canvas below is a bit less accurate since it's a 280x280 canvas scaled down and redrawn with the back-end. With the MNIST database, the neural network hits about 94-95% accuracy.
        </Typography>
        <Typography>
          Draw a digit from 0-9
        </Typography>
        <div className="canvas">
          <CanvasDraw 
            ref={canvasDraw => (setSaveableCanvas(canvasDraw))}
            {...state}
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button 
            onClick={()=>{
              saveableCanvas.clear();
            }}
            color="secondary"
            variant="outlined"
          >
            Reset
          </Button>
          <Button 
            onClick={()=>{
              setImageData(saveableCanvas.getSaveData());
            }}
            color="primary"
            variant="outlined"
          >
            Guess
          </Button>
        </div>
        <Typography variant="h5">
          Your number is {response}
        </Typography>
      </div>
    </ThemeProvider>
  );
}

export default App;