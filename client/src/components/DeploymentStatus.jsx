import "../styles/DeploymentStatus.css";

function DeploymentStatus({ status }) {
  if (!status) return null;

  return (
    <div
      className={`deployment-status ${status.success ? "success" : "error"}`}
    >
      <h3>Deployment Status</h3>
      <p className="status-message">{status.message}</p>

      {status.success && status.data && (
        <div className="status-details">
          <h4>Details:</h4>
          <pre>{JSON.stringify(status.data, null, 2)}</pre>
        </div>
      )}

      {!status.success && status.error && (
        <div className="status-details">
          <h4>Error Details:</h4>
          <pre>
            {typeof status.error === "object"
              ? JSON.stringify(status.error, null, 2)
              : status.error}
          </pre>
        </div>
      )}
    </div>
  );
}

export default DeploymentStatus;
