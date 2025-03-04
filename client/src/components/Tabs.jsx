import "../styles/Tabs.css";

function Tabs({ activeTab, onTabChange }) {
  return (
    <div className="tabs">
      <button
        className={`tab ${activeTab === "new" ? "active" : ""}`}
        onClick={() => onTabChange("new")}
      >
        Deploy New Instance
      </button>
      <button
        className={`tab ${activeTab === "existing" ? "active" : ""}`}
        onClick={() => onTabChange("existing")}
      >
        Deploy to Existing Instance
      </button>
    </div>
  );
}

export default Tabs;
