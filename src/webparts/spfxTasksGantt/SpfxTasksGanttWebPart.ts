import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SpfxTasksGanttWebPartStrings';
import SpfxTasksGantt from './components/SpfxTasksGantt';
import { ISpfxTasksGanttProps } from './components/ISpfxTasksGanttProps';
import { PropertyPaneAsyncDropdown } from './components/AsyncDropdown/PropertyPaneAsyncDropdown';
import { setup as pnpSetup } from '@pnp/common';
import { update, isEmpty } from '@microsoft/sp-lodash-subset';
import { GanttService } from './services/GanttService';

export interface ISpfxTasksGanttWebPartProps {
  description: string;
  tasksListSiteUrl: string;
  tasksListTitle: string;
  title: string;
}

export default class SpfxTasksGanttWebPart extends BaseClientSideWebPart<ISpfxTasksGanttWebPartProps> {

  private _ganttService: GanttService;

  public render(): void {
    const element: React.ReactElement<ISpfxTasksGanttProps> = React.createElement(
      SpfxTasksGantt,
      {
        tasksListSiteUrl: this.properties.tasksListSiteUrl,
        tasksListTitle: this.properties.tasksListTitle,
        title: this.properties.title,
        displayMode: this.displayMode,
        updateProperty: (value: string) => {
          this.properties.title = value;
        }
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private loadLists = async (): Promise<IPropertyPaneDropdownOption[]> => {
    if (!isEmpty(this.properties.tasksListSiteUrl)) {
      const lists = await this._ganttService.getTaskLists(this.properties.tasksListSiteUrl);
      return lists.map(list => {
        return {
          key: list.Title,
          text: list.Title
        };
      });
    }
    return [];
  }

  private onListChange = async (propertyPath: string, newValue: any): Promise<any> => {
    update(this.properties, propertyPath, (): any => { return newValue; });
    this.render();
    this.context.propertyPane.refresh();
  }

  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {  
      pnpSetup({
        spfxContext: this.context
      });

      this._ganttService = GanttService.getInstance();

      this.properties.tasksListSiteUrl = this.context.pageContext.web.absoluteUrl;
    });
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('tasksListSiteUrl', {
                  label: strings.PropertyPaneTasksListSiteUrl,
                  placeholder: this.context.pageContext.web.absoluteUrl
                }),
                new PropertyPaneAsyncDropdown('tasksListTitle', {
                  label: strings.PropertyPaneTasksListTitle,
                  loadOptions: this.loadLists,
                  onPropertyChange: this.onListChange,
                  selectedKey: this.properties.tasksListTitle,
                  disabled: !this.properties.tasksListSiteUrl
                })
              ]
            },
          ]
        }
      ]
    };
  }
}
