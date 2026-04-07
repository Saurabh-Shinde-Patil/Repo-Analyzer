const githubService = require('./github.service');
const llmService = require('./llm.service');
const AppError = require('../utils/AppError');

class ChatService {
  async chatWithRepo(url, provider, question, history = []) {
    try {
      const { owner, repo } = githubService.parseRepoUrl(url);
      const branch = await githubService.getDefaultBranch(owner, repo);
      const treeData = await githubService.getRepoTree(owner, repo, branch);

      const paths = treeData.map(item => item.path);
      const filteredPaths = paths.filter(p =>
        !p.includes('node_modules') && !p.includes('.git/') &&
        !p.includes('dist/') && !p.includes('build/')
      );
      const topLevelPaths = filteredPaths
        .filter(p => p.split('/').length <= 2)
        .slice(0, 100)
        .join('\n');

      let readmeContent = '';
      const readmePath = filteredPaths.find(p => p.toLowerCase() === 'readme.md');
      if (readmePath) {
        try {
          const c = await githubService.getFileContent(owner, repo, branch, readmePath);
          readmeContent = `README.md snippet:\n${c.split('\n').slice(0, 40).join('\n')}`;
        } catch (e) {}
      }

      const systemMessage = {
        role: 'system',
        content: `You are an expert AI coding assistant with deep knowledge of the repository ${owner}/${repo}.

REPOSITORY CONTEXT:
- Repository: ${owner}/${repo}
- Root Files & Folders:
${topLevelPaths}

${readmeContent}

INSTRUCTIONS:
1. Answer questions directly and concisely about this specific repository.
2. Reference specific files, folders, and code patterns when relevant.
3. Keep answers brief, friendly, and straight to the point.
4. You have memory of previous messages in this conversation — use them for context.
5. If asked about something not in the provided context, reason intelligently from what you know.`,
      };

      // Include last 10 messages of history for context window efficiency
      const recentHistory = history.slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      }));

      const messages = [
        systemMessage,
        ...recentHistory,
        { role: 'user', content: question },
      ];

      const response = await llmService.generateChatResponse(messages, provider);
      return { response };

    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Chat failed: ${error.message}`, 500);
    }
  }
}

module.exports = new ChatService();
