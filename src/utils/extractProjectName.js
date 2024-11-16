const extractProjectName = (repoUrl) => {
  const segment = repoUrl.split("/").pop();
  return segment.endsWith(".git") ? segment.slice(0, -4) : segment;
};

module.exports = extractProjectName;
