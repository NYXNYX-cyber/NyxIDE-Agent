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
    label: 'btn',
    insertText: '<button type="\${1:button}">\${2:Button}</button>',
    documentation: 'Button (shortcut)',
  },
  {
    label: 'h1',
    insertText: '<h1>\${1:Heading 1}</h1>',
    documentation: 'Heading 1',
  },
  {
    label: 'h2',
    insertText: '<h2>\${1:Heading 2}</h2>',
    documentation: 'Heading 2',
  },
  {
    label: 'h3',
    insertText: '<h3>\${1:Heading 3}</h3>',
    documentation: 'Heading 3',
  },
  {
    label: 'h4',
    insertText: '<h4>\${1:Heading 4}</h4>',
    documentation: 'Heading 4',
  },
  {
    label: 'h5',
    insertText: '<h5>\${1:Heading 5}</h5>',
    documentation: 'Heading 5',
  },
  {
    label: 'h6',
    insertText: '<h6>\${1:Heading 6}</h6>',
    documentation: 'Heading 6',
  },
  {
    label: 'p',
    insertText: '<p>\${1:Paragraph}</p>',
    documentation: 'Paragraph',
  },
  {
    label: 'span',
    insertText: '<span>\$0</span>',
    documentation: 'Span element',
  },
  {
    label: 'spanc',
    insertText: '<span class="\$1">\${0}</span>',
    documentation: 'Span with class',
  },
  {
    label: 'section',
    insertText: `<section>
  \$0
</section>`,
    documentation: 'Section element',
  },
  {
    label: 'article',
    insertText: `<article>
  \$0
</article>`,
    documentation: 'Article element',
  },
  {
    label: 'header',
    insertText: `<header>
  \$0
</header>`,
    documentation: 'Header element',
  },
  {
    label: 'footer',
    insertText: `<footer>
  \$0
</footer>`,
    documentation: 'Footer element',
  },
  {
    label: 'nav',
    insertText: `<nav>
  \$0
</nav>`,
    documentation: 'Navigation element',
  },
  {
    label: 'main',
    insertText: `<main>
  \$0
</main>`,
    documentation: 'Main content element',
  },
  {
    label: 'aside',
    insertText: `<aside>
  \$0
</aside>`,
    documentation: 'Aside element',
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
    label: 'li',
    insertText: '<li>\$0</li>',
    documentation: 'List item',
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
    label: 'thead',
    insertText: `<thead>
  <tr>
    <th>\$0</th>
  </tr>
</thead>`,
    documentation: 'Table head',
  },
  {
    label: 'tbody',
    insertText: `<tbody>
  <tr>
    <td>\$0</td>
  </tr>
</tbody>`,
    documentation: 'Table body',
  },
  {
    label: 'tr',
    insertText: `<tr>
  <td>\$0</td>
</tr>`,
    documentation: 'Table row',
  },
  {
    label: 'th',
    insertText: '<th>\$0</th>',
    documentation: 'Table header cell',
  },
  {
    label: 'td',
    insertText: '<td>\$0</td>',
    documentation: 'Table data cell',
  },
  {
    label: 'form',
    insertText: `<form action="\$1" method="\${2:post}">
  \$0
</form>`,
    documentation: 'Form',
  },
  {
    label: 'inputtext',
    insertText: '<input type="text" name="\$1" id="\$2" placeholder="\$3">',
    documentation: 'Text input',
  },
  {
    label: 'inputemail',
    insertText: '<input type="email" name="\$1" id="\$2" placeholder="\$3">',
    documentation: 'Email input',
  },
  {
    label: 'inputpassword',
    insertText: '<input type="password" name="\$1" id="\$2">',
    documentation: 'Password input',
  },
  {
    label: 'inputsubmit',
    insertText: '<input type="submit" value="\${1:Submit}">',
    documentation: 'Submit button',
  },
  {
    label: 'textarea',
    insertText: `<textarea name="\$1" id="\$2" rows="\${3:4}" cols="\${4:50}">\$0</textarea>`,
    documentation: 'Textarea',
  },
  {
    label: 'select',
    insertText: `<select name="\$1" id="\$2">
  <option value="\$3">\${4:Option}</option>
</select>`,
    documentation: 'Select dropdown',
  },
  {
    label: 'option',
    insertText: '<option value="\$1">\${2:Option}</option>',
    documentation: 'Select option',
  },
  {
    label: 'label',
    insertText: '<label for="\$1">\${2:Label}</label>',
    documentation: 'Label',
  },
  {
    label: 'script',
    insertText: '<script src="\$1"></script>',
    documentation: 'Script tag',
  },
  {
    label: 'scriptinline',
    insertText: `<script>
  \$0
</script>`,
    documentation: 'Inline script',
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
  {
    label: 'metacharset',
    insertText: '<meta charset="UTF-8">',
    documentation: 'Meta charset',
  },
  {
    label: 'metaviewport',
    insertText: '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    documentation: 'Meta viewport',
  },
  {
    label: 'br',
    insertText: '<br>',
    documentation: 'Line break',
  },
  {
    label: 'hr',
    insertText: '<hr>',
    documentation: 'Horizontal rule',
  },
  {
    label: 'strong',
    insertText: '<strong>\${1:text}</strong>',
    documentation: 'Strong/bold text',
  },
  {
    label: 'em',
    insertText: '<em>\${1:text}</em>',
    documentation: 'Emphasis/italic text',
  },
  {
    label: 'b',
    insertText: '<b>\${1:text}</b>',
    documentation: 'Bold text',
  },
  {
    label: 'i',
    insertText: '<i>\${1:text}</i>',
    documentation: 'Italic text',
  },
  {
    label: 'u',
    insertText: '<u>\${1:text}</u>',
    documentation: 'Underline text',
  },
  {
    label: 'code',
    insertText: '<code>\$0</code>',
    documentation: 'Code inline',
  },
  {
    label: 'pre',
    insertText: `<pre>
\$0
</pre>`,
    documentation: 'Preformatted text',
  },
  {
    label: 'video',
    insertText: `<video controls width="\${1:640}" height="\${2:360}">
  <source src="\$3" type="video/mp4">
  Your browser does not support the video tag.
</video>`,
    documentation: 'Video element',
  },
  {
    label: 'audio',
    insertText: `<audio controls>
  <source src="\$1" type="audio/mpeg">
  Your browser does not support the audio tag.
</audio>`,
    documentation: 'Audio element',
  },
  {
    label: 'iframe',
    insertText: '<iframe src="\$1" width="\${2:600}" height="\${3:400}" frameborder="0"></iframe>',
    documentation: 'Iframe',
  },
  {
    label: 'canvas',
    insertText: '<canvas id="\$1" width="\${2:300}" height="\${3:150}"></canvas>',
    documentation: 'Canvas element',
  },
  {
    label: 'details',
    insertText: `<details>
  <summary>\${1:Summary}</summary>
  \$0
</details>`,
    documentation: 'Details/accordion',
  },
  {
    label: 'dialog',
    insertText: `<dialog>
  \$0
</dialog>`,
    documentation: 'Dialog/modal',
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
