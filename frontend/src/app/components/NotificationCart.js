import { Box, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function NotificationCart() {
  return (
    <Box>
      <IconButton size="small" sx={{ color: "black" }}>
        <NotificationsIcon />
      </IconButton>
      <IconButton size="small" sx={{ color: "black" }}>
        <ShoppingCartIcon />
      </IconButton>
    </Box>

  );
}
