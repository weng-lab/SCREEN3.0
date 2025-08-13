import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MenuList, ListItemIcon, ListItemText } from "@mui/material";
import { Category, Close } from "@mui/icons-material";

type OpenEntitiesTabsMenuProps = {
  handleCloseAll: () => void;
  handleSort: () => void;
  disableCloseAll: boolean;
  disableSort: boolean;
};

const OpenEntitiesTabsMenu = (props: OpenEntitiesTabsMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleCloseAllClick = () => {
    props.handleCloseAll();
    handleCloseMenu();
  };

  const handleSortClick = () => {
    props.handleSort();
    handleCloseMenu();
  };

  return (
    <>
      <IconButton onClick={handleOpenMenu}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        component={MenuList}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleSortClick} disabled={props.disableSort}>
          <ListItemIcon>
            <Category fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Sort Tabs</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCloseAllClick} disabled={props.disableCloseAll}>
          <ListItemIcon>
            <Close fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Close Other Tabs</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default OpenEntitiesTabsMenu;
