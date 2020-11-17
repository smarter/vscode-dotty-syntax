import { ExtensionContext,  Disposable } from 'vscode'
import * as vscode from 'vscode'

const keywords = [
  "abstract", "as", "case", "catch", "class", "def", "derives", "do", "enum", "erased", "else",
  "end", "export", "extends", "extension", "false", "final", "finally", "for", "given",
  "if", "implicit", "import", "inline", "lazy", "match", "new", "null", "object", "open", "override", "package",
  "private", "protected", "return", "sealed", "super", "then", "this", "throw", "trait",
  "transparent", "try", "true", "type", "using", "val", "var", "while", "with", "yield"
]

class KeywordCompletionItemProvider implements vscode.CompletionItemProvider {
  public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    let range = document.getWordRangeAtPosition(position)
    let prefix = range ? document.getText(range) : ""

    let completions = []
    for (const keyword of keywords) {
      if (prefix.length === 0 || keyword.length >= prefix.length && keyword.substr(0, prefix.length) === prefix)
        completions.push(new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Keyword))
    }
    return completions
  }
}

export function activate(ctx: ExtensionContext) {
  // Override the language configuration from vscode-scala and metals-vscode (doing this from
  // package.json does not work)
  vscode.languages.setLanguageConfiguration("scala", {
    "indentationRules": {
      // Auto-indent when pressing enter on a line matching this regexp, in details:
      // 1. If they're not preceded by `end`, auto-indent after `while`, `for`, `match`, `try`, `if`
      // 2. Auto-indent after `if ...` as long as it doesn't match `if ... then ...`
      // 3. Auto-indent after `then`, `else`, `do`, `catch`, `finally`, `yield`, `case`, `=`, `=>`, `<-`, `=>>`, `:`
      "increaseIndentPattern":
        /(((?<!\bend\b\s*?)\b(if|while|for|match|try))|(\bif\s+(?!.*?\bthen\b.*?$)[^\s]*?)|(\b(then|else|do|catch|finally|yield|case))|=|=>|<-|=>>|:)\s*?$/,
      // Only auto-unindent completed `end` followed by `while`, `for`, `match`, `try`, `if`
      "decreaseIndentPattern": /(^\s*end\b\s*)\b(if|while|for|match|try)$/
    }
  })

  ctx.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "scala", new KeywordCompletionItemProvider()))
}
