import {React} from "react";

import {Container,Grid,CardMedia, Card, CardContent, Typography, Paper} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import ArrowIcon from '@material-ui/icons/ArrowForward';
import MoonImg from '../../../../../assets/moon.png'
import {makeMil} from '../../../../../utils/numUtils';

const WhiteTextTypography = withStyles({
    root: {
      color: "#8dfcb4"
    }
  })(Typography);
 
const Body = (props) => {
    return (     
        <Container style={{display:"flex", flexDirection:"row", alignItems:"baseline"}}>
                    <Paper key={props.body.Name} style={{alignItems: "baseline"}}>
                        <Grid container style={{display: "flex", alignItems: "baseline"}}>
                            <Grid item xs={12} style={{position: "relative", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignContent: "center", padding: 0, flexBasis: 0, margin:0}}>
                                <img alt="body" src={MoonImg} style={{zIndex: 10, height: "4em", borderRadius: "50%", width:"4em", margin:"0px" }} />
                                <WhiteTextTypography color="white" variant="h6" style={{position: "absolute",   top: "50%",  left: "50%",padding:"0px", transform: `translate(-50%, -50%)`, zIndex: 50}}>{props.body.Name.substring(props.dest.Name.length)}</WhiteTextTypography>
                            </Grid>
                            <Grid item container xs={12} style={{width: "7em"}}>
                                <Grid item xs={6}>
                                    Scan Value:
                                </Grid>
                                <Grid item xs={6}>
                                    {makeMil(props.body.ScanValue)}
                                </Grid>
                                <Grid item xs={6}>
                                    Map Value:
                                </Grid>
                                <Grid item xs={6}>
                                    {makeMil(props.body.MappingValue)}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
            {props.index === props.dest.Bodies.length -1 ? null : <ArrowIcon />}
        </Container>
    )
}


export default Body;