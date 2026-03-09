const Notification = ({ message }) => {
  const successStyle = {
    color: "#1b5e20",
    background: "#e8f5e9",
    fontSize: "16px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderLeftWidth: "10px", // High-contrast dashboard indicator
    borderColor: "#4caf50",
    borderRadius: "4px",
    padding: "15px 20px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease-in-out",
    fontFamily: "sans-serif",
  };

  if (message === null) {
    return null;
  }

  return (
    <div style={successStyle} className="success">
      {message}
    </div>
  );
};

export default Notification;
