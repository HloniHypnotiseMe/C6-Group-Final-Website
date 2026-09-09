const ts = require('typescript');

module.exports = {
  process(sourceText, filename) {
    const result = ts.transpileModule(sourceText, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        moduleResolution: ts.ModuleResolutionKind.NodeJs,
        esModuleInterop: true,
        sourceMap: true,
      },
      fileName: filename,
    });

    return {
      code: result.outputText,
      map: result.sourceMapText,
    };
  },
};
