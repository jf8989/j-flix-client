// Profile picture utilities
// Import all profile pictures
import pic1 from "../assets/images/profile-pics/1.webp";
import pic2 from "../assets/images/profile-pics/2.webp";
import pic3 from "../assets/images/profile-pics/3.webp";
import pic4 from "../assets/images/profile-pics/4.webp";
import pic5 from "../assets/images/profile-pics/5.webp";
import pic6 from "../assets/images/profile-pics/6.webp";
import pic7 from "../assets/images/profile-pics/7.webp";
import pic8 from "../assets/images/profile-pics/8.webp";
import pic9 from "../assets/images/profile-pics/9.webp";
import pic10 from "../assets/images/profile-pics/10.webp";
import pic11 from "../assets/images/profile-pics/11.webp";
import pic12 from "../assets/images/profile-pics/12.webp";
import pic13 from "../assets/images/profile-pics/13.webp";
import pic14 from "../assets/images/profile-pics/14.webp";
import pic15 from "../assets/images/profile-pics/15.webp";
import pic16 from "../assets/images/profile-pics/16.webp";
import pic17 from "../assets/images/profile-pics/17.webp";

// Map filename to imported path
const profilePictureMap = {
  "1.webp": pic1,
  "2.webp": pic2,
  "3.webp": pic3,
  "4.webp": pic4,
  "5.webp": pic5,
  "6.webp": pic6,
  "7.webp": pic7,
  "8.webp": pic8,
  "9.webp": pic9,
  "10.webp": pic10,
  "11.webp": pic11,
  "12.webp": pic12,
  "13.webp": pic13,
  "14.webp": pic14,
  "15.webp": pic15,
  "16.webp": pic16,
  "17.webp": pic17,
};

// Array of profile pictures with their IDs and names
export const profilePics = [
  { id: 1, name: "1.webp", path: pic1 },
  { id: 2, name: "2.webp", path: pic2 },
  { id: 3, name: "3.webp", path: pic3 },
  { id: 4, name: "4.webp", path: pic4 },
  { id: 5, name: "5.webp", path: pic5 },
  { id: 6, name: "6.webp", path: pic6 },
  { id: 7, name: "7.webp", path: pic7 },
  { id: 8, name: "8.webp", path: pic8 },
  { id: 9, name: "9.webp", path: pic9 },
  { id: 10, name: "10.webp", path: pic10 },
  { id: 11, name: "11.webp", path: pic11 },
  { id: 12, name: "12.webp", path: pic12 },
  { id: 13, name: "13.webp", path: pic13 },
  { id: 14, name: "14.webp", path: pic14 },
  { id: 15, name: "15.webp", path: pic15 },
  { id: 16, name: "16.webp", path: pic16 },
  { id: 17, name: "17.webp", path: pic17 },
];

/**
 * Get the imported path for a profile picture by filename
 * @param {string} filename - The filename (e.g., "1.webp")
 * @returns {string} The imported path
 */
export const getProfilePicturePath = (filename) => {
  if (!filename) return pic1; // Default to first picture
  return profilePictureMap[filename] || pic1;
};

/**
 * Get the filename from a path (extracts just the filename)
 * @param {string} path - The path (can be imported path or filename)
 * @returns {string} The filename
 */
export const getProfilePictureFilename = (path) => {
  if (!path) return "1.webp";

  // If it's already just a filename, return it
  if (path.endsWith(".webp") && !path.includes("/")) {
    return path;
  }

  // Extract filename from path
  const parts = path.split("/");
  const filename = parts[parts.length - 1];

  // Check if it's a valid filename
  if (profilePictureMap[filename]) {
    return filename;
  }

  // Default to first picture
  return "1.webp";
};
