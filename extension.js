const vscode = require("vscode");
const os = require("os");
const fs = require("fs");
const path = require("path");

// Folder of the workspace that owns the active file, else the first workspace folder, else home.
function workingDir() {
  const uri = vscode.window.activeTextEditor?.document.uri;
  const folder = (uri && vscode.workspace.getWorkspaceFolder(uri)) || vscode.workspace.workspaceFolders?.[0];
  return folder ? folder.uri.fsPath : os.homedir();
}

// VS Code keeps the PATH it started with, so a Pi installed later isn't found by name.
// Swap a leading bare "pi" for the installer's launcher when it exists.
function resolveCommand(command) {
  const launcher = path.join(os.homedir(), ".pi", "agent", "bin", process.platform === "win32" ? "pi.cmd" : "pi");
  const match = /^pi(\s|$)/.exec(command);
  if (!match || !fs.existsSync(launcher)) return command;
  return `"${launcher}"${command.slice(2)}`;
}

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand("pi.openTerminal", () => {
      const command = resolveCommand(vscode.workspace.getConfiguration("pi").get("command") || "pi");
      // Run Pi as the terminal's process (not typed into a shell), so the tab closes when Pi exits.
      // On failure, pause so the error stays readable instead of the tab vanishing.
      const shell =
        process.platform === "win32"
          ? // A string (not an array) reaches cmd verbatim; an array would get its quotes backslash-escaped.
            { shellPath: process.env.ComSpec || "cmd.exe", shellArgs: `/d /c "${command} || pause"` }
          : { shellPath: "/bin/sh", shellArgs: ["-lc", `${command} || { printf '\nPress Enter to close'; read _; }`] };
      const terminal = vscode.window.createTerminal({
        name: "Pi",
        cwd: workingDir(),
        iconPath: {
          light: vscode.Uri.joinPath(context.extensionUri, "images", "button-dark.svg"),
          dark: vscode.Uri.joinPath(context.extensionUri, "images", "button-light.svg"),
        },
        location: { viewColumn: vscode.ViewColumn.Beside },
        ...shell,
      });
      terminal.show();
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
