import { BrowserWindow } from "electron";
import { MAIN_WINDOW_TITLE } from "@/consts/window";

export default function getMainWindow() {
  const windows = BrowserWindow.getAllWindows();
  const mainWindow = windows.find((window) => window.title === MAIN_WINDOW_TITLE);

  return mainWindow;
}

export function getAllExceptMainWindow() {
  const windows = BrowserWindow.getAllWindows();
  const mainWindow = windows.filter((window) => window.title !== MAIN_WINDOW_TITLE);

  return mainWindow;
}
