"use client"

import type React from "react"
import { useState } from "react"

interface NewInstanceFormProps {
  onDeploy: (data: any) => void
}

export default function NewInstanceForm({ onDeploy }: NewInstanceFormProps) {
  const [repoUrl, setRepoUrl] = useState("")
  const [instanceType, setInstanceType] = useState("t2.micro")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onDeploy({ repoUrl, instanceType })
  }

  return (
    <form onSubmit={handleSubmit} className="deployment-form">
      <h2>Deploy New Instance</h2>
      <div>
        <label htmlFor="repoUrl">GitHub Repo URL:</label>
        <input type="text" id="repoUrl" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="instanceType">Instance Type:</label>
        <select id="instanceType" value={instanceType} onChange={(e) => setInstanceType(e.target.value)}>
          <option value="t2.micro">t2.micro</option>
          <option value="t2.medium">t2.medium</option>
          <option value="t2.large">t2.large</option>
        </select>
      </div>
      <button type="submit">Deploy</button>
    </form>
  )
}

