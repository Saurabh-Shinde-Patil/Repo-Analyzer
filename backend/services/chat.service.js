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
      // Limit to 100 paths to prevent Groq/Llama token limit crashes on large repos
      const topLevelPaths = filteredPaths.filter(p => p.split('/').length <= 2).slice(0, 100).join('\n');

      let readmeContent = '';
      const readmePath = filteredPaths.find(p => p.toLowerCase() === 'readme.md');
      if (readmePath) {
        try {
          const c = await githubService.getFileContent(owner, repo, branch, readmePath);
          // Limit to 40 lines to prevent Groq/Llama context window or tokens-per-minute limits
          readmeContent = `README.md snippet:\n${c.split('\n').slice(0, 40).join('\n')}`;
        } catch(e) {}
      }

      const prompt = `
        You are an expert AI coding assistant.
        
        USER QUESTION: "${question}"
        
        INSTRUCTIONS:
        1. Answer the USER QUESTION directly and concisely. 
        2. DO NOT output a general summary of the repository unless the user specifically asks for it.
        3. Keep your answer brief, friendly, and straight to the point.
        4. Use simple text formatting (e.g. lists, short paragraphs) to make it readable.
        
        Here is some context about the repository (${owner}/${repo}) to help you if needed:
        ---
        Root Files & Folders:
        ${topLevelPaths}

        ${readmeContent}
        ---
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
