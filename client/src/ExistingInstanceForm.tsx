"use client"

import type React from "react"
import { useState } from "react"

interface ExistingInstanceFormProps {
  onDeploy: (data: any) => void
}

export default function ExistingInstanceForm({ onDeploy }: ExistingInstanceFormProps) {
  const [repoUrl, setRepoUrl] = useState("")
  const [instanceId, setInstanceId] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onDeploy({ repoUrl, instanceId })
  }

  return (
    <form onSubmit={handleSubmit} className="deployment-form">
      <h2>Deploy to Existing Instance</h2>
      <div>
        <label htmlFor="repoUrl">GitHub Repo URL:</label>
        <input type="text" id="repoUrl" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="instanceId">Instance ID:</label>
        <input
          type="text"
          id="instanceId"
          value={instanceId}
          onChange={(e) => setInstanceId(e.target.value)}
          required
        />
      </div>
      <button type="submit">Deploy</button>
    </form>
  )
}

