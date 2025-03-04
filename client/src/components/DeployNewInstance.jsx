"use client";

import { useState } from "react";
import { deployNewInstance } from "../services/api.jsx";
import "../styles/DeployForm.css";

function DeployNewInstance({ setDeploymentStatus }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [instanceType, setInstanceType] = useState("t2.micro");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await deployNewInstance({ repoUrl, instanceType });
      setDeploymentStatus({
        success: true,
        message: "Deployment initiated successfully",
        data: response.data,
      });
    } catch (error) {
      setDeploymentStatus({
        success: false,
        message: "Deployment failed",
        error: error.response?.data || error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="deploy-form">
      <h2>Deploy New Instance</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="repo-url">GitHub Repository URL</label>
          <input
            id="repo-url"
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="instance-type">Instance Type</label>
          <select
            id="instance-type"
            value={instanceType}
            onChange={(e) => setInstanceType(e.target.value)}
          >
            <option value="t2.micro">t2.micro</option>
            <option value="t2.small">t2.small</option>
            <option value="t2.medium">t2.medium</option>
            <option value="t3.micro">t3.micro</option>
            <option value="t3.small">t3.small</option>
            <option value="t3.medium">t3.medium</option>
          </select>
        </div>

        <button type="submit" className="deploy-button" disabled={isLoading}>
          {isLoading ? "Deploying..." : "Deploy"}
        </button>
      </form>
    </div>
  );
}

export default DeployNewInstance;
