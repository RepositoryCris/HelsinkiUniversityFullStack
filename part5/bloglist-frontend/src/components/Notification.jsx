const Notification = ({ notification }) => {
  if (!notification || !notification.message) return null;

  // 1. Define the "Theme Map"
  const themes = {
    success: {
      color: "#1b5e20",
      background: "#e8f5e9",
      borderColor: "#4caf50",
      icon: "✅",
    },
    error: {
      color: "#b71c1c",
      background: "#ffebee",
      borderColor: "#f44336",
      icon: "⚠️",
    },
    warning: {
      color: "#856404",
      background: "#fff3cd",
      borderColor: "#ffeeba",
      icon: "🚧",
    },
    info: {
      color: "#0c5460",
      background: "#d1ecf1",
      borderColor: "#bee5eb",
      icon: "ℹ️",
    },
  };

  // 2. Fallback to 'info' if the type is missing or unknown
  const activeTheme = themes[notification.type] || themes.info;

  const style = {
    color: activeTheme.color,
    background: activeTheme.background,
    borderColor: activeTheme.borderColor,
    fontSize: "16px",
    borderStyle: "solid",
    borderWidth: "1px",
    borderLeftWidth: "10px",
    borderRadius: "4px",
    padding: "15px 20px",
    marginBottom: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease-in-out",
    fontFamily: "sans-serif",
  };

  return (
    <div
      style={style}
      className={`notification ${notification.type} notification-error`}
    >
      <span style={{ marginRight: "10px" }}>{activeTheme.icon}</span>
      {notification.message}
    </div>
  );
};

export default Notification;
