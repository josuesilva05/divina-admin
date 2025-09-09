import { BrowserWindow } from 'electron'
import { registerDatabaseHandlers } from './database-handlers'
import { addThemeEventListeners } from './theme/theme-listeners'
import { addWindowEventListeners } from './window/window-listeners'

export default function registerListeners(mainWindow: BrowserWindow) {
  addWindowEventListeners(mainWindow)
  addThemeEventListeners()
  registerDatabaseHandlers()
}
