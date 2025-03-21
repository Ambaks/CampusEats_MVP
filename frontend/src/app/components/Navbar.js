"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import MapIcon from "@mui/icons-material/Map";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

export default function Navbar() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(0);

  const actionSx = {
    color: "black",
    "&.Mui-selected": {
      color: "white", // teal blue color when selected
    },
  };

  return (
    <BottomNavigation
    className="z-999"
      value={selectedTab}
      onChange={(event, newValue) => {
        setSelectedTab(newValue);
        switch (newValue) {
          case 0:
            router.push("/");
            break;
          case 1:
            router.push("/map");
            break;
          case 2:
            router.push("/profile");
            break;
          case 3:
            router.push("/earn"); // Ensure this route exists
            break;
          default:
            break;
        }
      }}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#FF7F51",
        boxShadow: 4,
      }}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} sx={actionSx} />
      <BottomNavigationAction label="Map" icon={<MapIcon />} sx={actionSx}/>
      <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} sx={actionSx}/>
      <BottomNavigationAction label="Earn" icon={<AttachMoneyIcon />} sx={actionSx}/>
    </BottomNavigation>
  );
}
