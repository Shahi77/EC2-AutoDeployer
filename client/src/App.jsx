"use client";

import { useState } from "react";
import Tabs from "./components/Tabs.jsx";
import DeployNewInstance from "./components/DeployNewInstance.jsx";
import DeployExistingInstance from "./components/DeployExistingInstance.jsx";
import DeploymentStatus from "./components/DeploymentStatus.jsx";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("new");
  const [deploymentStatus, setDeploymentStatus] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setDeploymentStatus(null); // Reset status when changing tabs
  };

  return (
    <div className="app-container">
      <header>
        <h1>Deployment Dashboard</h1>
      </header>

      <main>
        <Tabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="content-container">
          {activeTab === "new" ? (
            <DeployNewInstance setDeploymentStatus={setDeploymentStatus} />
          ) : (
            <DeployExistingInstance setDeploymentStatus={setDeploymentStatus} />
          )}
        </div>

        <DeploymentStatus status={deploymentStatus} />
      </main>
    </div>
  );
}

export default App;
