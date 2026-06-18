// Comprehensive snippet definitions for popular languages
export interface Snippet {
  label: string
  insertText: string
  documentation: string
  prefix?: string
}

export const htmlSnippets: Snippet[] = [
  // Basic HTML structure
  {
    label: '!',
    insertText: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>\${1:Document}</title>
  <style>
  </style>
</head>
<body>
  \${0}
</body>
</html>`,
    documentation: 'HTML5 boilerplate',
  },
  
  // Headings
  { label: 'h1', insertText: '<h1>${1:Heading 1}</h1>', documentation: 'Heading 1' },
  { label: 'h2', insertText: '<h2>${1:Heading 2}</h2>', documentation: 'Heading 2' },
  { label: 'h3', insertText: '<h3>${1:Heading 3}</h3>', documentation: 'Heading 3' },
  { label: 'h4', insertText: '<h4>${1:Heading 4}</h4>', documentation: 'Heading 4' },
  { label: 'h5', insertText: '<h5>${1:Heading 5}</h5>', documentation: 'Heading 5' },
  { label: 'h6', insertText: '<h6>${1:Heading 6}</h6>', documentation: 'Heading 6' },
  
  // Text elements
  { label: 'p', insertText: '<p>${1:Paragraph}</p>', documentation: 'Paragraph' },
  { label: 'span', insertText: '<span>${1}</span>', documentation: 'Span element' },
  { label: 'br', insertText: '<br>', documentation: 'Line break' },
  { label: 'hr', insertText: '<hr>', documentation: 'Horizontal rule' },
  { label: 'strong', insertText: '<strong>${1:Bold}</strong>', documentation: 'Strong text' },
  { label: 'em', insertText: '<em>${1:Italic}</em>', documentation: 'Italic text' },
  { label: 'mark', insertText: '<mark>${1:Highlighted}</mark>', documentation: 'Marked text' },
  { label: 'code', insertText: '<code>${1}</code>', documentation: 'Inline code' },
  { label: 'pre', insertText: '<pre><code>\${1}</code></pre>', documentation: 'Preformatted code' },
  
  // Container elements
  { label: 'div', insertText: '<div>${1}</div>', documentation: 'Div element' },
  { label: 'section', insertText: `<section>
  \${0}
</section>`, documentation: 'Section element' },
  { label: 'article', insertText: `<article>
  \${0}
</article>`, documentation: 'Article element' },
  { label: 'header', insertText: `<header>
  \${0}
</header>`, documentation: 'Header element' },
  { label: 'footer', insertText: `<footer>
  \${0}
</footer>`, documentation: 'Footer element' },
  { label: 'nav', insertText: `<nav>
  \${0}
</nav>`, documentation: 'Navigation element' },
  { label: 'main', insertText: `<main>
  \${0}
</main>`, documentation: 'Main content' },
  { label: 'aside', insertText: `<aside>
  \${0}
</aside>`, documentation: 'Aside element' },
  { label: 'figure', insertText: `<figure>
  \${0}
</figure>`, documentation: 'Figure element' },
  
  // Lists
  { label: 'ul', insertText: `<ul>
  <li>\${1}</li>
  <li>\${0}</li>
</ul>`, documentation: 'Unordered list' },
  { label: 'ol', insertText: `<ol>
  <li>\${1}</li>
  <li>\${0}</li>
</ol>`, documentation: 'Ordered list' },
  { label: 'li', insertText: '<li>${1}</li>', documentation: 'List item' },
  { label: 'dl', insertText: `<dl>
  <dt>\${1}</dt>
  <dd>\${2}</dd>
  <dt>\${0}</dt>
  <dd>\${0}</dd>
</dl>`, documentation: 'Definition list' },
  { label: 'dt', insertText: '<dt>${1}</dt>', documentation: 'Definition term' },
  { label: 'dd', insertText: '<dd>${1}</dd>', documentation: 'Definition description' },
  
  // Links and media
  { label: 'a', insertText: '<a href="${1}">\${2:Link}</a>', documentation: 'Anchor link' },
  { label: 'img', insertText: '<img src="${1}" alt="\${2}" />', documentation: 'Image' },
  { label: 'video', insertText: '<video src="${1}" controls>\${0}</video>', documentation: 'Video element' },
  { label: 'audio', insertText: '<audio src="${1}" controls>\${0}</audio>', documentation: 'Audio element' },
  { label: 'iframe', insertText: '<iframe src="${1}" width="640" height="360"></iframe>', documentation: 'iFrame' },
  { label: 'link', insertText: '<link rel="stylesheet" href="${1}.css">', documentation: 'CSS Link' },
  { label: 'script', insertText: '<script src="${1}.js"></script>', documentation: 'Script tag' },
  
  // Forms
  { label: 'form', insertText: `<form action="\${1}" method="\${2:post}">
  \${0}
</form>`, documentation: 'Form element' },
  { label: 'input', insertText: '<input type="${1:text}" name="${2}" id="${3}" placeholder="\${4}" />', documentation: 'Input field' },
  { label: 'textarea', insertText: '<textarea name="${1}" id="${2}" rows="4" placeholder="\${3}"></textarea>', documentation: 'Textarea' },
  { label: 'select', insertText: `<select name="\${1}" id="\${2}">
  <option value="">\${0:Select...}</option>
</select>`, documentation: 'Select dropdown' },
  { label: 'option', insertText: '<option value="${1}">\${2:Option}</option>', documentation: 'Select option' },
  { label: 'button', insertText: '<button type="submit">\${1:Submit}</button>', documentation: 'Button' },
  { label: 'fieldset', insertText: `<fieldset>
  <legend>\${1:Legend}</legend>
  \${0}
</fieldset>`, documentation: 'Fieldset' },
  { label: 'label', insertText: '<label for="\${1}">\${2:Label}</label>', documentation: 'Label' },
  
  // Tables
  { label: 'table', insertText: `<table>
  <thead>
    <tr>
      <th>\${1:Column 1}</th>
      <th>\${2:Column 2}</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>\${3:Data 1}</td>
      <td>\${4:Data 2}</td>
    </tr>
  </tbody>
</table>`, documentation: 'Table' },
  { label: 'thead', insertText: `<thead>
  \${0}
</thead>`, documentation: 'Table header' },
  { label: 'tbody', insertText: `<tbody>
  \${0}
</tbody>`, documentation: 'Table body' },
  { label: 'tfoot', insertText: `<tfoot>
  \${0}
</tfoot>`, documentation: 'Table footer' },
  { label: 'tr', insertText: `<tr>
  \${0}
</tr>`, documentation: 'Table row' },
  { label: 'th', insertText: '<th>${1:Header}</th>', documentation: 'Table header cell' },
  { label: 'td', insertText: '<td>${1}</td>', documentation: 'Table data cell' },
  
  // Meta and semantic
  { label: 'meta', insertText: '<meta name="${1:description}" content="\${2:Description}" />', documentation: 'Meta tag' },
  { label: 'title', insertText: '<title>\${1:Page Title}</title>', documentation: 'Title' },
]

export const phpSnippets: Snippet[] = [
  // PHP structure
  {
    label: '<?php',
    insertText: `<?php
\${0}
?>`,
    documentation: 'PHP tag',
  },
  {
    label: 'short',
    insertText: '<?= \${0} ?>',
    documentation: 'Short echo tag',
  },
  {
    label: 'docblock',
    insertText: `/**
 * \${1:Description}
 * 
 * @param type \${2:Variable}
 * @return type
 */`,
    documentation: 'DocBlock comment',
  },
  
  // Control structures
  {
    label: 'if',
    insertText: `if (\${1:condition}) {
    \${0}
}`,
    documentation: 'If statement',
  },
  {
    label: 'elseif',
    insertText: `elseif (\${1:condition}) {
    \${0}
}`,
    documentation: 'Else if statement',
  },
  {
    label: 'else',
    insertText: `else {
    \${0}
}`,
    documentation: 'Else statement',
  },
  {
    label: 'switch',
    insertText: `switch (\${1:variable}) {
    case \${2:value}:
        \${3}
        break;

    default:
        \${0}
        break;
}`,
    documentation: 'Switch statement',
  },
  {
    label: 'case',
    insertText: `case \${1:value}:
    \${2}
    break;`,
    documentation: 'Case statement',
  },
  
  // Loops
  {
    label: 'for',
    insertText: `for (\$i = 0; \$i < \${1:10}; \$i++) {
    \${0}
}`,
    documentation: 'For loop',
  },
  {
    label: 'foreach',
    insertText: `foreach (\${1:\$array} as \${2:\$key} => \${3:\$value}) {
    \${0}
}`,
    documentation: 'Foreach loop',
  },
  {
    label: 'while',
    insertText: `while (\${1:condition}) {
    \${0}
}`,
    documentation: 'While loop',
  },
  {
    label: 'do',
    insertText: `do {
    \${1}
} while (\${2:condition});`,
    documentation: 'Do-while loop',
  },
  
  // Class and function
  {
    label: 'class',
    insertText: `class \${1:ClassName} {
    
    /**
     * Constructor
     */
    public function __construct()
    {
        \${0}
    }
    
    /**
     * Method example
     */
    public function \${2:methodName}(): void
    {
        
    }
}`,
    documentation: 'Class definition',
  },
  {
    label: 'interface',
    insertText: `interface \${1:InterfaceName} {
    
    public function \${2:methodName}();
}`,
    documentation: 'Interface definition',
  },
  {
    label: 'trait',
    insertText: `trait \${1:TraitName} {
    
    public function \${2:methodName}(): void
    {
        
    }
}`,
    documentation: 'Trait definition',
  },
  {
    label: 'function',
    insertText: `function \${1:functionName}(\${2}): \${3:void}
{
    \${0}
}`,
    documentation: 'Function definition',
  },
  {
    label: 'lambda',
    insertText: `\${1:\$variable} = fn (\${2}) => \${0};`,
    documentation: 'Arrow function',
  },
  {
    label: 'fn',
    insertText: `fn (\${1}\$params) => \${0};`,
    documentation: 'Anonymous function',
  },
  
  // Variables
  {
    label: 'echo',
    insertText: `echo \${1:'Hello World'};`,
    documentation: 'Echo statement',
  },
  {
    label: 'print_r',
    insertText: `print_r(\${1:\$var});`,
    documentation: 'Print readable',
  },
  {
    label: 'var_dump',
    insertText: `var_dump(\${1:\$var});`,
    documentation: 'Variable dump',
  },
  {
    label: 'isset',
    insertText: `if (isset(\${1:\$var})) {
    \${0}
}`,
    documentation: 'Check variable set',
  },
  {
    label: 'empty',
    insertText: `if (empty(\${1:\$var})) {
    \${0}
}`,
    documentation: 'Check empty variable',
  },
  
  // Arrays
  {
    label: 'array',
    insertText: `[\${1} => \${2}]`,
    documentation: 'Array element',
  },
  {
    label: 'array_map',
    insertText: `array_map(fn(\$item) => \${0}, \$array);`,
    documentation: 'Array map',
  },
  {
    label: 'array_filter',
    insertText: `array_filter(\$array, fn(\$item) => \${0});`,
    documentation: 'Array filter',
  },
  {
    label: 'array_reduce',
    insertText: `array_reduce(\$array, function(\$carry, \$item) {
    return \${0};
}, \${1:init_value});`,
    documentation: 'Array reduce',
  },
  {
    label: 'json_encode',
    insertText: `json_encode(\${1:\$data}, JSON_PRETTY_PRINT);`,
    documentation: 'JSON encode',
  },
  {
    label: 'json_decode',
    insertText: `json_decode(\${1:\$json}, true);`,
    documentation: 'JSON decode',
  },
  
  // Superglobals
  {
    label: 'GET',
    insertText: `$_GET['\${1}']`,
    documentation: 'GET superglobal',
  },
  {
    label: 'POST',
    insertText: `$_POST['\${1}']`,
    documentation: 'POST superglobal',
  },
  {
    label: 'REQUEST',
    insertText: `$_REQUEST['\${1}']`,
    documentation: 'REQUEST superglobal',
  },
  {
    label: 'SESSION',
    insertText: `$_SESSION['\${1}']`,
    documentation: 'SESSION superglobal',
  },
  {
    label: 'COOKIE',
    insertText: `$_COOKIE['\${1}']`,
    documentation: 'COOKIE superglobal',
  },
  {
    label: 'SERVER',
    insertText: `$_SERVER['\${1}']`,
    documentation: 'SERVER superglobal',
  },
  {
    label: 'ENV',
    insertText: `$_ENV['\${1}']`,
    documentation: 'ENV superglobal',
  },
  
  // Error handling
  {
    label: 'try-catch',
    insertText: `try {
    \${0}
} catch (\Exception \$e) {
    error_log(\$e->getMessage());
}`,
    documentation: 'Try-catch block',
  },
  {
    label: 'throw',
    insertText: `throw new \Exception('\${1:Error message}');`,
    documentation: 'Throw exception',
  },
  {
    label: 'exit',
    insertText: `exit(1);`,
    documentation: 'Exit script',
  },
  {
    label: 'die',
    insertText: `die('\${1:Error}');`,
    documentation: 'Die with message',
  },
  
  // Strings
  {
    label: 'heredoc',
    insertText: `$text = <<<EOT
\${1:Text content}
EOT;`,
    documentation: 'Heredoc syntax',
  },
  {
    label: 'nowdoc',
    insertText: `$text = <<<'EOT'
\${1:Text content}
EOT;`,
    documentation: 'Nowdoc syntax',
  },
  {
    label: 'concat',
    insertText: `"\${1}" . "\${0}"`,
    documentation: 'String concatenation',
  },
  {
    label: 'strlen',
    insertText: `strlen(\${1:\$string})`,
    documentation: 'String length',
  },
  {
    label: 'strtolower',
    insertText: `strtolower(\${1:\$str})`,
    documentation: 'Lower case',
  },
  {
    label: 'strtoupper',
    insertText: `strtoupper(\${1:\$str})`,
    documentation: 'Upper case',
  },
]

export const javascriptSnippets: Snippet[] = [
  // Arrow functions
  {
    label: 'const',
    insertText: `const \${1:name} = (\${2:args}) => \${0};`,
    documentation: 'Constant arrow function',
  },
  {
    label: 'let',
    insertText: `let \${1:name} = \${0};`,
    documentation: 'Let variable',
  },
  {
    label: 'var',
    insertText: `var \${1:name} = \${0};`,
    documentation: 'Var variable',
  },
  
  // Classes
  {
    label: 'class',
    insertText: `class \${1:ClassName} {
    constructor(\${2}) {
        \${0}
    }
}`,
    documentation: 'ES6 Class',
  },
  {
    label: 'constructor',
    insertText: `constructor(\${1}) {
    \${0}
}`,
    documentation: 'Constructor',
  },
  
  // Promises & Async
  {
    label: 'async',
    insertText: `async function \${1:functionName}() {
    \${0}
}`,
    documentation: 'Async function',
  },
  {
    label: 'promise',
    insertText: `new Promise((resolve, reject) => {
    \${0}
});`,
    documentation: 'Promise',
  },
  {
    label: 'fetch',
    insertText: "fetch(`\${1:url}`)\n    .then(response => response.json())\n    .then(data => \${0})\n    .catch(error => console.error('Error:', error));",
    documentation: 'Fetch API',
  },
  
  // Functions
  {
    label: 'func',
    insertText: `function \${1:name}(\${2}) {
    \${0}
}`,
    documentation: 'Function declaration',
  },
  {
    label: 'arrow',
    insertText: `\${1} = (\${2}) => \${0}`,
    documentation: 'Arrow function',
  },
  {
    label: 'console.log',
    insertText: `console.log('\${1}', \${0});`,
    documentation: 'Console log',
  },
  {
    label: 'console.table',
    insertText: `console.table(\${1:\$data});`,
    documentation: 'Console table',
  },
  
  // Modules
  {
    label: 'import',
    insertText: `import \${1:*} from '\${2:./module}';`,
    documentation: 'Import module',
  },
  {
    label: 'export',
    insertText: `export default \${1:name};`,
    documentation: 'Export default',
  },
  {
    label: 'require',
    insertText: `const \${1} = require('\${2:module}');`,
    documentation: 'CommonJS require',
  },
  
  // Arrays
  {
    label: 'map',
    insertText: `\${1:\$array}.map(item => \${0});`,
    documentation: 'Array map',
  },
  {
    label: 'filter',
    insertText: `\${1:\$array}.filter(item => \${0});`,
    documentation: 'Array filter',
  },
  {
    label: 'reduce',
    insertText: `\${1:\$array}.reduce((acc, curr) => \${0}, \${2:[]});`,
    documentation: 'Array reduce',
  },
  {
    label: 'find',
    insertText: `\${1:\$array}.find(item => \${0});`,
    documentation: 'Array find',
  },
  {
    label: 'forEach',
    insertText: `\${1:\$array}.forEach(item => \${0});`,
    documentation: 'Array forEach',
  },
  
  // Destructuring
  {
    label: 'obj-destructure',
    insertText: `const { \${1:key }} = \${2:object};`,
    documentation: 'Object destructuring',
  },
  {
    label: 'arr-destructure',
    insertText: `const [ \${1:a}, \${2:b} ] = \${3:array};`,
    documentation: 'Array destructuring',
  },
  
  // Default values
  {
    label: 'default-param',
    insertText: `function \${1:name}(\${2:param} = \${0:"default"}) {
}`,
    documentation: 'Default parameter',
  },
  {
    label: 'spread',
    insertText: `[... \${1:\$array}]`,
    documentation: 'Spread operator',
  },
  
  // Template literals
  {
    label: 'template',
    insertText: `\`\${1:\\${1}}\``,
    documentation: 'Template literal',
  },
  {
    label: 'interpolate',
    insertText: `\`\${\${1:variable}}\``,
    documentation: 'Interpolation',
  },
  
  // Try-Catch
  {
    label: 'try-catch',
    insertText: `try {
    \${0}
} catch (error) {
    console.error(error);
}`,
    documentation: 'Try-catch block',
  },
  
  // Assertions
  {
    label: 'assert',
    insertText: `assert(\${1:condition}, '\${2:Message}');`,
    documentation: 'Assertion',
  },
  
  // Type checking
  {
    label: 'typeof',
    insertText: `typeof \${1:\$variable}`,
    documentation: 'Type of',
  },
  {
    label: 'instanceof',
    insertText: `\${1:\$variable} instanceof \${2:Class}`,
    documentation: 'Instance check',
  },
  
  // DOM manipulation
  {
    label: 'getElementById',
    insertText: `document.getElementById('\${1:id}')`,
    documentation: 'Get element by ID',
  },
  {
    label: 'querySelector',
    insertText: `document.querySelector('\${1:.class}')`,
    documentation: 'Query selector',
  },
  {
    label: 'addEventListener',
    insertText: `\${1:element}.addEventListener('\${2:event}', () => \${0});`,
    documentation: 'Add event listener',
  },
]

export const pythonSnippets: Snippet[] = [
  // Python basic
  {
    label: '#!/usr/bin/env python3',
    insertText: `#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
\${1:Module Description}
"""

from typing import \${2:any}

def main() -> int:
    \${0}
    return 0

if __name__ == '__main__':
    exit(main())
`,
    documentation: 'Python script template',
  },
  
  // Variables and types
  {
    label: 'var',
    insertText: '\${1:name} = \${0}',
    documentation: 'Variable assignment',
  },
  {
    label: 'def',
    insertText: `def \${1:function_name}(\${2:parameters}) -> \${3:return_type}:
    \${0}
`,
    documentation: 'Function definition',
  },
  {
    label: 'class',
    insertText: `class \${1:ClassName}:
    """\${2:Docstring}"""
    
    def __init__(self, \${3:arg}):
        self.\${4} = \${3}
    
    def \${5:method}(self):
        pass
`,
    documentation: 'Class definition',
  },
  
  // Control structures
  {
    label: 'if',
    insertText: `if \${1:condition}:
    \${0}
`,
    documentation: 'If statement',
  },
  {
    label: 'elif',
    insertText: `elif \${1:condition}:
    \${0}
`,
    documentation: 'Elif statement',
  },
  {
    label: 'else',
    insertText: `else:
    \${0}
`,
    documentation: 'Else statement',
  },
  {
    label: 'for',
    insertText: `for \${1:item} in \${2:iterable}:
    \${0}
`,
    documentation: 'For loop',
  },
  {
    label: 'while',
    insertText: `while \${1:condition}:
    \${0}
`,
    documentation: 'While loop',
  },
  {
    label: 'break',
    insertText: 'break',
    documentation: 'Break loop',
  },
  {
    label: 'continue',
    insertText: 'continue',
    documentation: 'Continue loop',
  },
  
  // Try-except
  {
    label: 'try-except',
    insertText: `try:
    \${0}
except Exception as e:
    print(f"Error: {{e}}")
`,
    documentation: 'Try-except block',
  },
  {
    label: 'finally',
    insertText: `finally:
    \${0}
`,
    documentation: 'Finally clause',
  },
  
  // List comprehensions
  {
    label: 'list-comp',
    insertText: '[\${1:item} for \${2:item} in \${3:list}]',
    documentation: 'List comprehension',
  },
  {
    label: 'dict-comp',
    insertText: '{\${1:key}: \${2:value} for \${3:key} in \${4:list}}',
    documentation: 'Dictionary comprehension',
  },
  {
    label: 'set-comp',
    insertText: '{\${1:item} for \${2:item} in \${3:list}}',
    documentation: 'Set comprehension',
  },
  
  // Decorators
  {
    label: 'decorator',
    insertText: `@property
def \${1:property_name}(self) -> \${2:return_type}:
    return self._\${1}
`,
    documentation: 'Property decorator',
  },
  {
    label: '@staticmethod',
    insertText: `@staticmethod
def \${1:static_method}() -> None:
    \${0}
`,
    documentation: 'Static method',
  },
  {
    label: '@classmethod',
    insertText: `@classmethod
def \${1:class_method}(cls) -> None:
    \${0}
`,
    documentation: 'Class method',
  },
  
  // String formatting
  {
    label: 'f-string',
    insertText: `f"{\${1:value}}"`,
    documentation: 'f-string literal',
  },
  {
    label: 'format',
    insertText: `'\${0}'.format(\${1:value})`,
    documentation: 'String format method',
  },
  {
    label: '%s',
    insertText: `'%s' % \${1:value}`,
    documentation: 'Old-style string format',
  },
  
  // Imports
  {
    label: 'import',
    insertText: 'import \${1:module}',
    documentation: 'Import module',
  },
  {
    label: 'from-import',
    insertText: 'from \${1:module} import \${0}',
    documentation: 'From import',
  },
  {
    label: 'as',
    insertText: 'import \${1:module} as \${0}',
    documentation: 'Import alias',
  },
  
  // Print
  {
    label: 'print',
    insertText: 'print(\'\${1:hello world}\')',
    documentation: 'Print statement',
  },
  
  // Type hints
  {
    label: 'Optional',
    insertText: 'Optional[\${1:type}]',
    documentation: 'Optional type',
  },
  {
    label: 'List',
    insertText: 'List[\${1:type}]',
    documentation: 'List type',
  },
  {
    label: 'Dict',
    insertText: 'Dict[\${1:type}, \${2:value}]',
    documentation: 'Dict type',
  },
]

export const cssSnippets: Snippet[] = [
  {
    label: 'cl',
    insertText: `.class {\n\t\${0}\n}`,
    documentation: 'CSS class',
  },
  {
    label: '#id',
    insertText: `#\${1:id} {\n\t\${0}\n}`,
    documentation: 'CSS ID selector',
  },
  {
    label: 'd',
    insertText: 'display: flex;',
    documentation: 'Display flex',
  },
  {
    label: 'jcc',
    insertText: 'justify-content: center;',
    documentation: 'Justify content center',
  },
  {
    label: 'aic',
    insertText: 'align-items: center;',
    documentation: 'Align items center',
  },
  {
    label: 'fg',
    insertText: `flex-grow: \${0};`,
    documentation: 'Flex grow',
  },
  {
    label: 'fw',
    insertText: `flex-wrap: \${0};`,
    documentation: 'Flex wrap',
  },
  {
    label: 'ai',
    insertText: 'align-items:',
    documentation: 'Align items',
  },
  {
    label: 'jc',
    insertText: 'justify-content:',
    documentation: 'Justify content',
  },
  {
    label: 'pd',
    insertText: 'padding:',
    documentation: 'Padding',
  },
  {
    label: 'm',
    insertText: 'margin:',
    documentation: 'Margin',
  },
  {
    label: 'bdr',
    insertText: 'border-radius:',
    documentation: 'Border radius',
  },
  {
    label: 'w',
    insertText: 'width:',
    documentation: 'Width',
  },
  {
    label: 'h',
    insertText: 'height:',
    documentation: 'Height',
  },
  {
    label: 'pos',
    insertText: 'position: absolute;',
    documentation: 'Position absolute',
  },
  {
    label: 'rel',
    insertText: 'position: relative;',
    documentation: 'Position relative',
  },
  {
    label: 'z',
    insertText: 'z-index:',
    documentation: 'Z-index',
  },
  {
    label: 'ov',
    insertText: 'overflow:',
    documentation: 'Overflow',
  },
  {
    label: 'trans',
    insertText: 'transition:',
    documentation: 'Transition',
  },
  {
    label: 'anim',
    insertText: 'animation:',
    documentation: 'Animation',
  },
  {
    label: '@media',
    insertText: `@media screen and (max-width: \${1:768px}) {
\t\${0}
}`,
    documentation: 'Media query',
  },
  {
    label: '@keyframes',
    insertText: `@keyframes \${1:fadeIn} {
\tfrom {
\t\${0}
	}
	to {
		
	}
}`,
    documentation: 'Keyframes animation',
  },
]

// Get snippets for a language
export function getSnippetsForLanguage(language: string): Snippet[] {
  const snippetMap: Record<string, Snippet[]> = {
    html: htmlSnippets,
    php: phpSnippets,
    javascript: javascriptSnippets,
    typescript: javascriptSnippets,
    python: pythonSnippets,
    css: cssSnippets,
  }
  
  return snippetMap[language] || []
}
