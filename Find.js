import ClassIcon from "@mui/icons-material/Class";
import GroupsIcon from "@mui/icons-material/Groups";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import SchoolIcon from "@mui/icons-material/School";
import ScienceIcon from "@mui/icons-material/Science";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import {
  Button, IconButton, List,
  ListSubheader, MenuItem, ToggleButton,
  ToggleButtonGroup
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import DropDown from "./DropDown.js";
import Place from "./Place.js";
export default function Find(props) {
  let { roomId } = useParams();
  if(roomId === undefined){
    roomId = 0;
  }
  roomId = roomId+"";
  const items = [[
    { name: "Room 2", id: "0", icon: ClassIcon,building:"Shattuck"},
    { name: "Room 3", id: "1", icon: ClassIcon,building:"Shattuck" },
  ],[
    { name: "Room 2", id: "2", icon: ClassIcon,building:"Baker" },
    { name: "Room 3", id: "3", icon: ClassIcon,building:"Baker" },
  ],[
    { name: "Meeting Room 2", id: "4", icon: GroupsIcon,building:"Putnam Library" },
    { name: "Room 3", id: "5", icon: ClassIcon,building:"Putnam Library"},
  ]];
  const concatenatedItems = items[0].concat(items[1].concat(items[2]))
  const [dest, setDest] = useState(0);
  const [startLocation, setStart2] = useState(roomId+"");
  console.log(startLocation);
  const [toggle,setToggle] = useState("left");
  const setStart = (id) => {
    console.log(id)
    setStart2(id)
  }
  const setDestination = (id) => {
    if(toggle==="left"){
    setDest(parseInt(id));
    }else{
      setStart(parseInt(id))
    }
  };
  const selectChange = (event) => {
    setDest(event.target.value)
  }
  const selectChange2 = (event) => {
    setStart(event.target.value)
  }
  const validateDirections = () => {
    for(var i = 0;i<items.length;i++){
      for(var l = 0;l<items[i].length;l++){
        if(startLocation===items[i].id){

        }
        if(!(dest==="") && dest===items[i].id){

        }
      }
    }
  }
  const getMenu = () => {
    return concatenatedItems.map((item,index) => {
      return <MenuItem value={index}>{item.name+", "+item.building}</MenuItem>
    })
  }
  const reverse = () => {
    const ogDest = JSON.parse(JSON.stringify(dest));
    console.log(startLocation);
    console.log(ogDest)
    setDest(startLocation)
    setStart(ogDest)
  }
  const handleToggle = (event,newValue) => {
    setToggle(newValue)
  }
  return (
    <div>
    <div style={{ marginTop: "20px", marginRight: "15px", marginLeft: "15px" }}>
      <div style={{display:"flex"}}>
       
        <DropDown label="Starting Point" value={dest} onChange={selectChange} getMenu={getMenu}/>
        <IconButton style={{ marginTop: "7.5px",marginLeft:"15px",marginRight:"15px" }} onClick={reverse}>
          <SwapHorizIcon />
        </IconButton>
        <DropDown label="Destination" value={startLocation} onChange={selectChange2} getMenu={getMenu} />

        
      </div>
      <ToggleButtonGroup style={{marginTop:"15px"}} onChange={handleToggle} value={toggle} exclusive={true}>
        <ToggleButton value="left" style={{height:"30px"}} key="left" color="primary">
          Start
        </ToggleButton>
        <ToggleButton value="right" style={{height:"30px"}} key="right" color="primary">
          Destination
        </ToggleButton>
      </ToggleButtonGroup>
      <List
        aria-labelledby="subheader"
        subheader={<ListSubheader id="subheader">Buildings</ListSubheader>}
      >
        <Place name="Shattuck" icon={SchoolIcon} collapsible items={items[0]} setDestination={setDestination}/>
        <Place name="Baker" icon={ScienceIcon} collapsible items={items[1]} setDestination={setDestination}/>
        <Place name="Putnam Library" icon={LocalLibraryIcon} collapsible items={items[2]} setDestination={setDestination}
        />
      </List>
      
    </div>
    <Button variant="contained" style={{width:"calc(100% - 30px)",left:"15px",right:"15px",height:"50px",position:"fixed",bottom:15}} onClick={validateDirections}>
    Start Directions
</Button>
</div>
  );
}



