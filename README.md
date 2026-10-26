# Pi Launcher for VS Code

An unofficial VS Code button that opens a [Pi](https://pi.dev) coding-agent terminal beside your editor, in the current workspace folder.

It does what the Claude Code and opencode buttons do for their CLIs: one click and the agent is running next to your code. It isn't an IDE integration, just a launcher. Pi runs in an ordinary VS Code terminal.

## Features

- **π button** in the editor title bar, plus an **Open Pi** command in the command palette.
- Opens Pi in a terminal tab **beside the editor**, in the workspace folder of the active file. With no file open, it uses the first workspace folder, or your home folder if there's no workspace.
- The tab **closes when you quit Pi**. If Pi fails to start, the tab stays open so you can read the error.
- **Works even if VS Code can't see Pi on its PATH**, for example when VS Code was already running when you installed Pi. If Pi's installer launcher exists (`~/.pi/agent/bin/pi.cmd` on Windows, `~/.pi/agent/bin/pi` elsewhere), the extension runs it directly.

## Install

There's no Marketplace listing yet. Build it from source (requires Node.js):

```bash
git clone https://github.com/mike-r129/vscode-pi-launcher
cd vscode-pi-launcher
npx @vscode/vsce package -o pi-launcher.vsix
code --install-extension pi-launcher.vsix
```

Then run **Developer: Reload Window**.

## Settings

| Setting | Default | Description |
|---|---|---|
| `pi.command` | `pi` | Command used to start Pi. Add flags here, e.g. `pi --continue` to reopen your last session, or `pi --model <provider>/<model>` to pick a model. |

## How it works

`extension.js` is about 50 lines of plain JavaScript, with no dependencies and no build step. It registers one command that creates a terminal running Pi directly, through `cmd.exe /c` on Windows or `/bin/sh -lc` elsewhere. Pi is the terminal's process rather than being typed into a shell. Read it before you install it; that's the point of keeping it small.

Tested on Windows with VS Code 1.143 and Pi 1.4.0. It should work on macOS and Linux, but that hasn't been tested yet.

## License

[MIT](LICENSE). Not affiliated with Pi or Earendil Works.
