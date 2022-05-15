import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
    ListItemButton,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import { useState } from "react";
import Collapsable from "./Collapsable.js";
export default function Place(props) {
  const [open, setOpen] = useState(false);
  const [collapsible, setCollapsable] = useState(false);
  const handleCollapse = () => {
    setCollapsable(!collapsible);
    setOpen(!open);
  };
  const Icon = props.icon;
  if (props.collapsible) {
    return (
      <>
        <ListItemButton button="true" onClick={handleCollapse}>
          <ListItemIcon>
            <Icon />
          </ListItemIcon>
          <ListItemText primary={props.name} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapsable
          open={collapsible}
          name={props.items}
          setDestination={props.setDestination}
        />
      </>
    );
  }
  return (
    <ListItemButton button="true" onClick={handleCollapse}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={props.name} />
    </ListItemButton>
  );
}
