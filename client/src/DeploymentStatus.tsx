interface DeploymentStatusProps {
  status: string | null
}

export default function DeploymentStatus({ status }: DeploymentStatusProps) {
  if (!status) return null

  return (
    <div className="deployment-status">
      <h3>Deployment Status:</h3>
      <pre>{status}</pre>
    </div>
  )
}

