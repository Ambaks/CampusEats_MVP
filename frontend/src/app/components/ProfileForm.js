import { TextField, Button, Avatar, MenuItem, Typography } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

export default function ProfileForm({ user, setUser }) {
  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle profile picture upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser({ ...user, profilePicture: imageUrl });
    }
  };

  return (
    <>
      <Typography variant="h5" align="center" gutterBottom>
        Edit Profile
      </Typography>

      {/* Profile Picture */}
      <div className="flex flex-col items-center my-4">
        <Avatar
          src={user.profilePicture}
          sx={{ width: 100, height: 100, marginBottom: 2 }}
        />
        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUpload />}
          className="mt-2"
        >
          Upload Photo
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
      </div>

      {/* Profile Form */}
      <form className="space-y-4">
        <TextField
          fullWidth
          label="First Name"
          name="firstName"
          value={user.firstName}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Last Name"
          name="lastName"
          value={user.lastName}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={user.email}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Phone"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          select
          label="Gender"
          name="gender"
          value={user.gender}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>
        <TextField
          fullWidth
          label="Age"
          name="age"
          type="number"
          value={user.age}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        <TextField
          fullWidth
          label="Username"
          name="username"
          value={user.username}
          onChange={handleChange}
          sx={{ marginBottom: 2 }}
        />
        
        {/* Save Button */}
        <Button fullWidth variant="contained" color="primary">
          Save Changes
        </Button>
      </form>
    </>
  );
}
