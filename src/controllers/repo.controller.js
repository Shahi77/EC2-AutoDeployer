const axios = require("axios");

/*
- fetch the repository link from the GitHub API using axios.
- functionality to extract the repository's `owner` and `repo` parameters from the URL.
- Returned the repository's URL in the response for use in the deployment process.
- error handling in case of non-existent or private repositories.
*/
const getRepoLink = async (req, res) => {
  const { owner, repo } = req.params;
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}`
    );
    const repoLink = response.data.html_url;
    console.log("Repository Link:", repoLink);
    res.status(200).json({ repoLink });
    return repoLink;
  } catch (error) {
    console.error("Error fetching repository:", error);
    res.status(404).json({ error: "Repository not found or not accessible" });
  }
};

module.exports = { getRepoLink };
