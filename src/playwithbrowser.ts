export type WaitSelectorParams = {
  Action: "WaitSelector";
  WaitSelector: string;
  Timeout?: number;
};

export type WaitParams = {
  Action: "Wait";
  Timeout: number;
};

export type ClickParams = {
  Action: "Click";
  Selector: string;
};

export type ScrollParams = {
  Action: "ScrollX" | "ScrollY" | "ScrollTo";
  Selector?: string;
  Value: number;
};

export type FillParams = {
  Action: "Fill";
  Selector: string;
  Value: string;
};

export type ExecuteParams = {
  Action: "Execute";
  Execute: string;
};

export type ScreenShotParams = {
  Action: "ScreenShot";
  fullScreenShot?: string;
  particularScreenShot?: string;
};

export type PlayWithBrowserActions = {
  Click: ClickParams;
  ScrollX: ScrollParams;
  ScrollY: ScrollParams;
  ScrollTo: ScrollParams;
  Fill: FillParams;
  Execute: ExecuteParams;
  ScreenShot: ScreenShotParams;
  WaitSelector: WaitSelectorParams;
  Wait: WaitParams;
};

export type PlayWithBrowser = PlayWithBrowserActions[keyof PlayWithBrowserActions][];
