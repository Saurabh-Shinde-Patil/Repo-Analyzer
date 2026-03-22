const githubService = require('./github.service');
const llmService = require('./llm.service');
const AppError = require('../utils/AppError');

class ChatService {
  async chatWithRepo(url, provider, question) {
    try {
      const { owner, repo } = githubService.parseRepoUrl(url);
      const branch = await githubService.getDefaultBranch(owner, repo);
      const treeData = await githubService.getRepoTree(owner, repo, branch);
      
      const paths = treeData.map(item => item.path);
      const filteredPaths = paths.filter(p => !p.includes('node_modules') && !p.includes('.git/') && !p.includes('dist/') && !p.includes('build/'));
      const topLevelPaths = filteredPaths.filter(p => p.split('/').length <= 2).join('\n');

      let readmeContent = '';
      const readmePath = filteredPaths.find(p => p.toLowerCase() === 'readme.md');
      if (readmePath) {
        try {
          const c = await githubService.getFileContent(owner, repo, branch, readmePath);
          readmeContent = `README.md snippet:\n${c.split('\n').slice(0, 150).join('\n')}`;
        } catch(e) {}
      }

      const prompt = `
        You are an expert AI coding assistant helping a user understand a GitHub repository (${owner}/${repo}).
        
        Repository Context:
        Root Files & Folders:
        ${topLevelPaths}

        ${readmeContent}

        User Question: ${question}

        Answer the user's question clearly, concisely, and accurately based on the context provided.
        Format your response nicely with markdown (e.g. bolding, code blocks, lists if applicable).
      `;

      const response = await llmService.generateResponse(prompt, provider);
      return { response };

    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Chat failed: ${error.message}`, 500);
    }
  }
}

module.exports = new ChatService();
