export const generateShortId = (objectId) => {
    // Hash the ObjectId and create a numeric hash value
    const hashValue = parseInt(objectId.slice(-4), 16); // Use the last 4 characters for better uniqueness
    return (hashValue % 10000).toString().padStart(4, "0"); // Ensure it's always 4 digits
  };
  

  export const getFormattedTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata'
    });
  };
  
  export const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // e.g., 29/05
  };