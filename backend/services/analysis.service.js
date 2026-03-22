const githubService = require('./github.service');
const llmService = require('./llm.service');
const AppError = require('../utils/AppError');

const extractJSON = (text) => {
  try {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (match && match[1]) return JSON.parse(match[1]);
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse JSON from LLM:", text);
    return null; 
  }
};

class AnalysisService {
  
  async analyzeRepository(url, provider) {
    try {
      const { owner, repo } = githubService.parseRepoUrl(url);
      const branch = await githubService.getDefaultBranch(owner, repo);
      const treeData = await githubService.getRepoTree(owner, repo, branch);
      
      const paths = treeData.map(item => item.path);
      const filteredPaths = paths.filter(p => !p.includes('node_modules') && !p.includes('.git/') && !p.includes('dist/') && !p.includes('build/'));

      // 1. Prepare Data for M1 (Folder Structure)
      const topLevelPaths = filteredPaths.filter(p => p.split('/').length <= 2).join('\n');

      // 2. Prepare Data for M2 (Entry Point)
      const entryCandidates = ['server.js', 'app.js', 'index.js', 'main.py', 'app.py', 'manage.py', 'src/index.js', 'src/main.js', 'src/server.js'];
      let entryPoint = filteredPaths.find(p => entryCandidates.includes(p)) || filteredPaths.find(p => p.endsWith('.js') || p.endsWith('.py') || p.endsWith('.ts'));
      let entryContent = '// Not found';
      if (entryPoint) {
        try {
          entryContent = await githubService.getFileContent(owner, repo, branch, entryPoint);
          entryContent = entryContent.split('\n').slice(0, 300).join('\n');
        } catch(e) {}
      }

      // 3. Prepare Data for M3 (Dependency Mapping)
      const keyFiles = filteredPaths.filter(p => !p.includes('test') && (p.includes('route') || p.includes('controller') || p.includes('service')) && (p.endsWith('.js') || p.endsWith('.ts') || p.endsWith('.py'))).slice(0, 5);
      let importsMap = '';
      for (const file of keyFiles) {
        try {
          const content = await githubService.getFileContent(owner, repo, branch, file);
          const importLines = content.split('\n').filter(line => line.includes('import ') || line.includes('require(')).join('\n');
          if (importLines) importsMap += `\nFile: ${file}\nImports:\n${importLines}\n`;
        } catch (e) {}
      }

      // 4. Prepare Data for Summary (B3)
      let pkgContent = '';
      const pkgJson = filteredPaths.find(p => p.toLowerCase() === 'package.json');
      if (pkgJson) {
        try {
          const c = await githubService.getFileContent(owner, repo, branch, pkgJson);
          pkgContent = `package.json snippet:\n${c.split('\n').slice(0, 50).join('\n')}`;
        } catch(e) {}
      }

      let readmeContent = '';
      const readmePath = filteredPaths.find(p => p.toLowerCase() === 'readme.md');
      if (readmePath) {
        try {
          const c = await githubService.getFileContent(owner, repo, branch, readmePath);
          readmeContent = `README.md snippet:\n${c.split('\n').slice(0, 200).join('\n')}`;
        } catch(e) {}
      }

      // 5. Generate Master Prompt
      const prompt = `
        You are an expert System Architect. I will provide you with data extracted from a GitHub repository (${owner}/${repo}).
        You MUST analyze the entire dataset and respond with exactly ONE valid JSON object holding all the required information.
        Do not add Markdown text outside of the JSON. Do not add markdown codeblocks. Just raw valid JSON.

        DATA EXCERPTS:
        ---
        Root Files & Folders:
        ${topLevelPaths}

        Possible Entry File: ${entryPoint}
        Entry Content Snippet:
        ${entryContent}

        Dependency Imports Map:
        ${importsMap}

        Config/Package Data:
        ${pkgContent}

        README Knowledge (For B3 Accuracy):
        ${readmeContent}

        All Parsed Paths (for finding critical files):
        ${filteredPaths.filter(p => p.includes('.js') || p.includes('.py') || p.includes('.ts') || p.includes('.go') || p.includes('.jsx') || p.includes('.tsx') || p.includes('.java')).join('\n')}
        ---

        EXPECTED JSON SCHEMA EXACT MATCH (Fill with real analyzed data based on the excerpts):
        {
          "m1": [
            { "folder": "<path>", "description": "<what it does>" }
          ],
          "m2": {
            "entryFile": "${entryPoint || 'Unknown'}",
            "steps": [
              "<step 1 of execution flow from reading the entry point>",
              "<step 2...>"
            ]
          },
          "b2": [
            "<step 1 of a typical runtime request flow (e.g. Request -> Route -> Controller -> Service -> Model)>",
            "<step 2...>"
          ],
          "m3": [
            { "source": "<file path>", "target": "<file path it depends on>" }
          ],
          "bugs": [
            { "file": "<path>", "issue": "<description>", "severity": "High", "suggestion": "<fix>" }
          ],
          "apiEndpoints": [
            { "method": "GET", "path": "/api/example", "handler": "<file path>", "description": "<what it does>" }
          ],
          "envVars": [
            { "name": "<VAR_NAME>", "usedIn": "<file path>", "description": "<purpose of this env var>" }
          ],
          "summary": {
            "techStack": ["<tech 1>", "<tech 2>"],
            "architecture": "<mvc, microservices, etc>",
            "keyDesignDecisions": ["<decision 1...>", "<decision 2...>"],
            "summary": "<1 paragraph overarching summary of what the project is>"
          },
          "criticalFiles": [
            { "file": "<path to critical file>", "reason": "<why it is the most critical logic file>" }
          ]
        }
      `;

      // Single API Call to completely evade 15 RPM / quota limits
      const llmResult = await llmService.generateResponse(prompt, provider);
      const parsedData = extractJSON(llmResult) || {};

      return {
        summary: parsedData.summary || { techStack: [], architecture: 'Unknown', keyDesignDecisions: [], summary: 'Failed to generate output due to AI hallucination.' },
        b2: parsedData.b2 || [],
        m1: parsedData.m1 || [],
        m2: parsedData.m2 || { entryFile: entryPoint || 'Unknown', steps: ['Not available'] },
        m3: parsedData.m3 || [],
        criticalFiles: parsedData.criticalFiles || [],
        bugs: parsedData.bugs || [],
        apiEndpoints: parsedData.apiEndpoints || [],
        envVars: parsedData.envVars || [],
        repo: `${owner}/${repo}`
      };

    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Analysis failed: ${error.message}`, 500);
    }
  }
}

module.exports = new AnalysisService();
