"use client";

import { useState } from "react";
import { deployToExistingInstance } from "../services/api.jsx";
import "../styles/DeployForm.css";

function DeployExistingInstance({ setDeploymentStatus }) {
  const [repoUrl, setRepoUrl] = useState("");
  const [instanceId, setInstanceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await deployToExistingInstance({ repoUrl, instanceId });
      setDeploymentStatus({
        success: true,
        message: "Deployment to existing instance initiated successfully",
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
      <h2>Deploy to Existing Instance</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="repo-url-existing">GitHub Repository URL</label>
          <input
            id="repo-url-existing"
            type="text"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/username/repo"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="instance-id">Instance ID</label>
          <input
            id="instance-id"
            type="text"
            value={instanceId}
            onChange={(e) => setInstanceId(e.target.value)}
            placeholder="i-0123456789abcdef0"
            required
          />
        </div>

        <button type="submit" className="deploy-button" disabled={isLoading}>
          {isLoading ? "Deploying..." : "Deploy"}
        </button>
      </form>
    </div>
  );
}

export default DeployExistingInstance;
