import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
    Collapse, List, ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import { useState } from "react";
import AdditionalInfo from "./AdditionalInfo.js";
export default function Collapsable(props) {
    const [open,setOpen] = useState(false)
    const setDestination = (index) => {
      props.setDestination(props.name[index].id);
      setOpen(!open)
    };
    const getIcon = (Icon) => {
      return <Icon />;
    };
    return (
      <Collapse in={props.open} timeout="auto">
        <List disablePadding>
          {props.name.map((item, index) => (
            <>
            <ListItemButton
              key={item.id}
              sx={{ pl: 4 }}
              onClick={() => setDestination(index)}
            >
              <ListItemIcon>{getIcon(item.icon)}</ListItemIcon>
              <ListItemText primary={item.name+", "+item.building} />
              {open ? <ExpandLess /> : <ExpandMore />}
  
            </ListItemButton>
            <AdditionalInfo open={open} data={["Its an amazing place"]}/>
            </>
          ))}
        </List>
      </Collapse>
    );
  }