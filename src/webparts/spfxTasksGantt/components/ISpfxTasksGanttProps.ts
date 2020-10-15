import { DisplayMode } from "@microsoft/sp-core-library";

export interface ISpfxTasksGanttProps {
  tasksListSiteUrl: string;
  tasksListTitle: string;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
}
