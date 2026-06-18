// Snippet definitions for popular languages
// Format: { label, insertText, documentation, sortText }

export interface Snippet {
  label: string
  insertText: string
  documentation: string
  sortText?: string
}

export const htmlSnippets: Snippet[] = [
  {
    label: '!',
    insertText: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${1:Document}</title>
</head>
<body>
  \$0
</body>
</html>`,
    documentation: 'HTML5 Boilerplate',
    sortText: '0000',
  },
  {
    label: 'html5',
    insertText: `<!DOCTYPE html>
<html lang="\${1:en}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${2:Document}</title>
</head>
<body>
  \$0
</body>
</html>`,
    documentation: 'HTML5 Document',
  },
  {
    label: 'div',
    insertText: '<div>\$0</div>',
    documentation: 'Div element',
  },
  {
    label: 'divc',
    insertText: '<div class="\$1">\${0}</div>',
    documentation: 'Div with class',
  },
  {
    label: 'divi',
    insertText: '<div id="\$1">\${0}</div>',
    documentation: 'Div with id',
  },
  {
    label: 'a',
    insertText: '<a href="\$1">\${2:Link}</a>',
    documentation: 'Anchor link',
  },
  {
    label: 'img',
    insertText: '<img src="\$1" alt="\${2:Image}">',
    documentation: 'Image',
  },
  {
    label: 'input',
    insertText: '<input type="\${1:text}" name="\$2" id="\$3">',
    documentation: 'Input field',
  },
  {
    label: 'button',
    insertText: '<button type="\${1:button}">\${2:Button}</button>',
    documentation: 'Button',
  },
  {
    label: 'form',
    insertText: `<form action="\$1" method="\${2:post}">
  \$0
</form>`,
    documentation: 'Form',
  },
  {
    label: 'ul',
    insertText: `<ul>
  <li>\$0</li>
</ul>`,
    documentation: 'Unordered list',
  },
  {
    label: 'ol',
    insertText: `<ol>
  <li>\$0</li>
</ol>`,
    documentation: 'Ordered list',
  },
  {
    label: 'table',
    insertText: `<table>
  <thead>
    <tr>
      <th>\$1</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>\$0</td>
    </tr>
  </tbody>
</table>`,
    documentation: 'Table',
  },
  {
    label: 'script',
    insertText: '<script src="\$1"></script>',
    documentation: 'Script tag',
  },
  {
    label: 'style',
    insertText: `<style>
  \$0
</style>`,
    documentation: 'Style tag',
  },
  {
    label: 'link',
    insertText: '<link rel="stylesheet" href="\$1">',
    documentation: 'Link stylesheet',
  },
  {
    label: 'meta',
    insertText: '<meta name="\$1" content="\$2">',
    documentation: 'Meta tag',
  },
]

export const phpSnippets: Snippet[] = [
  {
    label: 'php',
    insertText: '<?php\n\$0\n?>',
    documentation: 'PHP tags',
    sortText: '0000',
  },
  {
    label: 'echo',
    insertText: 'echo \${1:"\$2"};',
    documentation: 'Echo statement',
  },
  {
    label: 'print_r',
    insertText: 'print_r(\$1);',
    documentation: 'Print array/object',
  },
  {
    label: 'var_dump',
    insertText: 'var_dump(\$1);',
    documentation: 'Var dump',
  },
  {
    label: 'func',
    insertText: `function \${1:functionName}(\${2:\$params}) {
  \$0
}`,
    documentation: 'Function',
  },
  {
    label: 'class',
    insertText: `class \${1:ClassName} {
  public function __construct() {
    \$0
  }
}`,
    documentation: 'Class',
  },
  {
    label: 'if',
    insertText: `if (\${1:condition}) {
  \$0
}`,
    documentation: 'If statement',
  },
  {
    label: 'ife',
    insertText: `if (\${1:condition}) {
  \$2
} else {
  \$0
}`,
    documentation: 'If-else statement',
  },
  {
    label: 'for',
    insertText: `for (\$i = 0; \$i < \${1:count}; \$i++) {
  \$0
}`,
    documentation: 'For loop',
  },
  {
    label: 'foreach',
    insertText: `foreach (\${1:\$array} as \${2:\$item}) {
  \$0
}`,
    documentation: 'Foreach loop',
  },
  {
    label: 'while',
    insertText: `while (\${1:condition}) {
  \$0
}`,
    documentation: 'While loop',
  },
  {
    label: 'try',
    insertText: `try {
  \$1
} catch (Exception \${2:\$e}) {
  \$0
}`,
    documentation: 'Try-catch',
  },
  {
    label: 'array',
    insertText: '\$array = [\$0];',
    documentation: 'Array',
  },
  {
    label: 'html',
    insertText: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${1:Document}</title>
</head>
<body>
  <?php
  \$0
  ?>
</body>
</html>`,
    documentation: 'PHP + HTML boilerplate',
  },
]

export const javascriptSnippets: Snippet[] = [
  {
    label: 'log',
    insertText: 'console.log(\$1);',
    documentation: 'Console log',
    sortText: '0000',
  },
  {
    label: 'func',
    insertText: `function \${1:functionName}(\${2:params}) {
  \$0
}`,
    documentation: 'Function declaration',
  },
  {
    label: 'afunc',
    insertText: `const \${1:functionName} = (\${2:params}) => {
  \$0
};`,
    documentation: 'Arrow function',
  },
  {
    label: 'for',
    insertText: `for (let i = 0; i < \${1:array}.length; i++) {
  \$0
}`,
    documentation: 'For loop',
  },
  {
    label: 'forof',
    insertText: `for (const \${1:item} of \${2:array}) {
  \$0
}`,
    documentation: 'For...of loop',
  },
  {
    label: 'forin',
    insertText: `for (const \${1:key} in \${2:object}) {
  \$0
}`,
    documentation: 'For...in loop',
  },
  {
    label: 'if',
    insertText: `if (\${1:condition}) {
  \$0
}`,
    documentation: 'If statement',
  },
  {
    label: 'ife',
    insertText: `if (\${1:condition}) {
  \$2
} else {
  \$0
}`,
    documentation: 'If-else statement',
  },
  {
    label: 'try',
    insertText: `try {
  \$1
} catch (error) {
  console.error(error);
  \$0
}`,
    documentation: 'Try-catch',
  },
  {
    label: 'class',
    insertText: `class \${1:ClassName} {
  constructor() {
    \$0
  }
}`,
    documentation: 'Class',
  },
  {
    label: 'async',
    insertText: `async function \${1:functionName}(\${2:params}) {
  try {
    \$0
  } catch (error) {
    console.error(error);
  }
}`,
    documentation: 'Async function',
  },
  {
    label: 'promise',
    insertText: `new Promise((resolve, reject) => {
  \$0
})`,
    documentation: 'Promise',
  },
  {
    label: 'fetch',
    insertText: `fetch('\${1:url}')
  .then(response => response.json())
  .then(data => {
    \$0
  })
  .catch(error => console.error(error));`,
    documentation: 'Fetch API',
  },
  {
    label: 'addEventListener',
    insertText: `\${1:element}.addEventListener('\${2:event}', (e) => {
  \$0
});`,
    documentation: 'Event listener',
  },
  {
    label: 'setInterval',
    insertText: `setInterval(() => {
  \$0
}, \${1:1000});`,
    documentation: 'Set interval',
  },
  {
    label: 'setTimeout',
    insertText: `setTimeout(() => {
  \$0
}, \${1:1000});`,
    documentation: 'Set timeout',
  },
]

export const typescriptSnippets: Snippet[] = [
  ...javascriptSnippets,
  {
    label: 'interface',
    insertText: `interface \${1:InterfaceName} {
  \$0
}`,
    documentation: 'Interface',
  },
  {
    label: 'type',
    insertText: `type \${1:TypeName} = {
  \$0
};`,
    documentation: 'Type alias',
  },
  {
    label: 'enum',
    insertText: `enum \${1:EnumName} {
  \$0
}`,
    documentation: 'Enum',
  },
]

export const pythonSnippets: Snippet[] = [
  {
    label: 'def',
    insertText: `def \${1:function_name}(\${2:params}):
    \$0`,
    documentation: 'Function definition',
    sortText: '0000',
  },
  {
    label: 'class',
    insertText: `class \${1:ClassName}:
    def __init__(self):
        \$0`,
    documentation: 'Class',
  },
  {
    label: 'if',
    insertText: `if \${1:condition}:
    \$0`,
    documentation: 'If statement',
  },
  {
    label: 'ife',
    insertText: `if \${1:condition}:
    \$2
else:
    \$0`,
    documentation: 'If-else statement',
  },
  {
    label: 'for',
    insertText: `for \${1:item} in \${2:iterable}:
    \$0`,
    documentation: 'For loop',
  },
  {
    label: 'while',
    insertText: `while \${1:condition}:
    \$0`,
    documentation: 'While loop',
  },
  {
    label: 'try',
    insertText: `try:
    \$1
except Exception as e:
    print(e)
    \$0`,
    documentation: 'Try-except',
  },
  {
    label: 'with',
    insertText: `with open('\${1:file}', '\${2:r}') as f:
    \$0`,
    documentation: 'With statement',
  },
  {
    label: 'import',
    insertText: 'import \${1:module}',
    documentation: 'Import module',
  },
  {
    label: 'from',
    insertText: 'from \${1:module} import \${2:name}',
    documentation: 'From import',
  },
  {
    label: 'print',
    insertText: 'print(\$1)',
    documentation: 'Print statement',
  },
]

// Get snippets for a specific language
export function getSnippetsForLanguage(language: string): Snippet[] {
  const snippetMap: Record<string, Snippet[]> = {
    html: htmlSnippets,
    php: phpSnippets,
    javascript: javascriptSnippets,
    typescript: typescriptSnippets,
    python: pythonSnippets,
  }
  
  return snippetMap[language] || []
}
