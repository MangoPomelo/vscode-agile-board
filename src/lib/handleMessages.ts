import * as path from "path";
import { ACTION, BLANK_SPACE_ALTERNATIVE } from "../core/constants";
import ReactPanel from "./reactPanel";
import { getDirectories, updateConfigJson, updateDirName } from "./utils";
import { window, Disposable, WebviewPanel } from "vscode";
import { createTask, openFileSide } from "./newTask";
import * as t from "../core/types";

// Handle messages from the webview
export default function handleMessages(
  panel: WebviewPanel,
  boardFolder: string,
  _disposables: Disposable[]
) {
  panel.webview.onDidReceiveMessage(
    (message) => {
      switch (message.action) {
        case ACTION.alert:
          window.showErrorMessage(message.data);
          break;
        case ACTION.updateJson:
          let dirPath = path.join(
            boardFolder,
            message.board.replace(/\s/g, BLANK_SPACE_ALTERNATIVE)
          );
          updateConfigJson(dirPath, message.data);
          break;
        case ACTION.renameBoard:
          let toValue = message.to.replace(/\s/g, BLANK_SPACE_ALTERNATIVE);
          let fromValue = message.from.replace(/\s/g, BLANK_SPACE_ALTERNATIVE);
          let fromDir = path.join(boardFolder, fromValue);
          let toDir = path.join(boardFolder, toValue);
          ReactPanel.panel.title = `VSAgile: ${message.to}`;
          updateDirName(fromDir, toDir);
          updateConfigJson(toDir, message.data);
          ReactPanel.panel.webview.postMessage({
            action: ACTION.allDirectories,
            data: getDirectories(boardFolder),
          });
          break;
        case ACTION.addTaskFile:
          let data: t.Board = message.data;
          let taskId = message.taskId;
          let boardName = message.boardName.replace(
            /\s/g,
            BLANK_SPACE_ALTERNATIVE
          );
          createTask(boardFolder, boardName, taskId).then((fileName) => {
            if (data.tasks[taskId].files) {
              data.tasks[taskId].files.push(fileName);
            } else {
              data.tasks[taskId].files = [fileName];
            }
            let boardPath = path.join(boardFolder, boardName);
            updateConfigJson(boardPath, data);
          });
          break;
        case ACTION.openTaskFile:
          let fullPath = path.join(
            boardFolder,
            message.boardName.replace(/\s/g, BLANK_SPACE_ALTERNATIVE),
            message.fileName
          );
          openFileSide(fullPath);
          break;
      }
    },
    null,
    _disposables
  );
}
