import React from "react";

import {Container,Avatar} from '@material-ui/core';

import ArrowIcon from '@material-ui/icons/ArrowForward';




 
const Body = (props) => {
    return (     
        <Container key={props.body.Name} style={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", padding: 0, flexBasis: 0, margin:0}}>
        <Avatar>
            {props.body.Name.substring(props.dest.Name.length)}
        </Avatar>
        {props.index === props.dest.Bodies.length -1 ? null : <ArrowIcon />}
        </Container>
    )
}


export default Body;