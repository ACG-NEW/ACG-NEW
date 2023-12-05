import { Action } from '@ngrx/store';

export const TOGGLE_SIDEBAR_MENU: string = 'TOGGLE_SIDEBAR_MENU';
export class ToggleSidebarMenu implements Action {
  readonly type: string = TOGGLE_SIDEBAR_MENU;
  constructor(public payload?: string) { }
}


export type UiAction =
  | ToggleSidebarMenu

