import { useState } from "react"
import axios from "axios"
import TabSelector from "./TabSelector"
import NewInstanceForm from "./NewInstanceForm"
import ExistingInstanceForm from "./ExistingInstanceForm"
import DeploymentStatus from "./DeploymentStatus"
import "./App.css"

export default function App() {
  const [activeTab, setActiveTab] = useState<"new" | "existing">("new")
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null)

  const handleDeploy = async (data: any, endpoint: string) => {
    try {
      const response = await axios.post(endpoint, data)
      setDeploymentStatus(JSON.stringify(response.data, null, 2))
    } catch (error) {
      setDeploymentStatus("Error: " + (error as Error).message)
    }
  }

  return (
    <div className="app">
      <h1>Deployment UI</h1>
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === "new" ? (
        <NewInstanceForm onDeploy={(data) => handleDeploy(data, "/new-instance")} />
      ) : (
        <ExistingInstanceForm onDeploy={(data) => handleDeploy(data, "/existing-instance")} />
      )}
      <DeploymentStatus status={deploymentStatus} />
    </div>
  )
}

