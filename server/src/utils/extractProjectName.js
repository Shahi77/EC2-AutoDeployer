const extractProjectName = (repoUrl) => {
  if (typeof repoUrl !== "string") {
    throw new Error("Invalid repository URL");
  }
  const segments = repoUrl.split("/");
  if (segments.length === 0) {
    throw new Error("Malformed repository URL");
  }
  const segment = segments.pop();
  return segment.endsWith(".git") ? segment.slice(0, -4) : segment;
};

module.exports = extractProjectName;
