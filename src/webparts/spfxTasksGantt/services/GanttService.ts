import '@pnp/sp/webs';
import '@pnp/sp/lists/web';
import '@pnp/sp/items/list';
import '@pnp/sp/sites';
import '@pnp/sp/fields';
import '@pnp/sp/search';
import '@pnp/sp/site-users';
import { ISearchQuery, SearchResults } from '@pnp/sp/search';
import { sp } from '@pnp/sp';
import { Site, ISite } from '@pnp/sp/sites';
import { isEmpty } from '@microsoft/sp-lodash-subset';
import { TASKS_LIST_TEMPLATE_ID } from '../consts';
import { IListInfo } from '@pnp/sp/lists';
import { ITask } from '../models/ITask';
import { IDropdownOption, IPersonaProps, IPersona } from 'office-ui-fabric-react';
import { IUser } from '../models/IUser';

const TASKS_SELECT_FIELDS = [
  'Id',
  'PercentComplete',
  'AssignedTo/Name',
  'AssignedTo/Id',
  'AssignedTo/Title',
  'Checkmark',
  'Created',
  'Body',
  'DueDate',
  'Modified',
  'Predecessors/Id',
  'Predecessors/Title',
  'RelatedItems',
  'Priority',
  'RelatedItems',
  'StartDate',
  'Title',
  'Status',
  'Author/Title',
  'Author/Name',
  'Editor/Title',
  'Editor/Name',
];

const CHOICE_FIELD_PROPERTIES = [
  'ID', 
  'Choices', 
  'FillInChoice', 
  'InternalName', 
  'FieldTypeKind'
];

const SP_PROPERTY_MAPPINGS = {
  id: 'Id',
  title: 'Title',
  percentComplete: 'PercentComplete',
  description: 'Body',
  completed: 'Checkmark',
  createdDate: 'Created',
  startDate: 'StartDate',
  dueDate: 'DueDate',
  status: 'Status',
  assignedToId: 'AssignedToId',
  predecessorsId: 'PredecessorsId',
  priority: 'Priority'
};

const TASKS_EXPAND_FIELDS = [
  'AssignedTo', 'Author', 'Editor', 'Predecessors'
];

const TASK_STATUS_COLUMN_NAME = 'Task Status';
const TASK_PRIORITY_COLUMN_NAME = 'Priority';

const PEOPLE_SEARCH_SELECT_PROPERTIES = [
  'PreferredName',
  'WorkEmail',
  'PictureURL',
  'JobTitle',
  'AccountName'
];

export class GanttService {

  private static instance: GanttService;

  private constructor() {
  }

  public static getInstance(): GanttService {
    try {
      if (!GanttService.instance) {
        GanttService.instance = new GanttService();
      }
  
      return GanttService.instance;
    }
    catch (error) {
      console.error(error);
    }
  }

  public async getTaskLists(siteUrl: string): Promise<IListInfo[]> {
    let lists = [];
    if (!isEmpty(siteUrl)) {
      try {
        const site = Site(siteUrl);
        lists = await site.rootWeb.lists.filter(`BaseTemplate eq ${TASKS_LIST_TEMPLATE_ID}`).get();
      }
      catch (error) {
        console.log(error);
      }
    }

    return lists;
  }

  public async getTasks(siteUrl: string, listTitle: string): Promise<ITask[]> {
    if (!isEmpty(siteUrl)) {
      try {
        const site = Site(siteUrl);
        const listItems = await site.rootWeb.lists.getByTitle(listTitle)
          .items
          .select(...TASKS_SELECT_FIELDS)
          .expand(...TASKS_EXPAND_FIELDS)
          .get();
        let tasks: ITask[] = listItems.map(listItem => {
          let assignedTo: IUser[] = [];
          if (listItem.AssignedTo) {
            assignedTo = listItem.AssignedTo.map(assigned => {
              return <IUser>{
                text: assigned.Title,
                imageUrl: this._getUserImage(assigned.Name),
                accountName: assigned.Name
              };
            });
          } 
          return <ITask>{
            id: listItem.Id,
            title: listItem.Title,
            description: listItem.Body,
            percentComplete: listItem.PercentComplete ? parseFloat(listItem.PercentComplete) : 0,
            completed: listItem.Checkmark === '0' ? false : true,
            createdDate: new Date(listItem.Created),
            startDate: new Date(listItem.StartDate),
            dueDate: new Date(listItem.DueDate),
            status: listItem.Status,
            predecessors: listItem.Predecessors ? 
              listItem.Predecessors.map(pre => ({ id: pre.Id, title: pre.Title })) : [],
            assignedTo: assignedTo,
            createdBy: {
              text: listItem.Author.Title,
              accountName: listItem.Author.Name,
              imageUrl: this._getUserImage(listItem.Author.Name)
            },
            priority: listItem.Priority
          };
        });
        
        tasks.sort((a, b) => {
          return a.startDate.getTime() - b.startDate.getTime();
        })
        return tasks;
      }
      catch (error) {
        console.log(error);
      }
    }
  }

  private _getUserImage(accountName: string): string {
    return `/_layouts/15/userphoto.aspx?Size=L&accountname=${accountName}`;
  }

  public async updateTask(siteUrl: string, listName: string, taskId: number, propertyName: string, propertyValue: any) {
    try {
      const sharePointPropertyName = SP_PROPERTY_MAPPINGS[propertyName];
      
      let updateProperties = {
        [sharePointPropertyName]: propertyValue
      };

      const site = Site(siteUrl);
      const updatedTaskResult = await site.rootWeb.lists
        .getByTitle(listName).items
        .getById(taskId)
        .update(updateProperties);

      return updatedTaskResult;
    }
    catch (error) {
      console.error(error);
    }
  }

  public async getStatusDropdownOptions(siteUrl: string, listName: string): Promise<IDropdownOption[]> {
    try {
      const site = Site(siteUrl);
      let options: IDropdownOption[] = [];
      const statusField = await site.rootWeb.lists.getByTitle(listName).fields.getByTitle(TASK_STATUS_COLUMN_NAME).select(...CHOICE_FIELD_PROPERTIES).get();
      if (statusField) {
        options = statusField['Choices'].map((choice: string) => {
          return {
            key: choice,
            text: choice
          };
        });
      }
      return options;
    }
    catch (error) {
      console.warn(error);
    }
  }

  public async getPriorityDropdownOptions(siteUrl: string, listName: string): Promise<IDropdownOption[]> {
    try {
      const site = Site(siteUrl);
      let options: IDropdownOption[] = [];
      const priorityField = await site.rootWeb.lists.getByTitle(listName).fields.getByTitle(TASK_PRIORITY_COLUMN_NAME).select(...CHOICE_FIELD_PROPERTIES).get();
      if (priorityField) {
        options = priorityField['Choices'].map((choice: string) => {
          return {
            key: choice,
            text: choice
          };
        });
      }
      return options;
    }
    catch (error) {
      console.warn(error);
    }
  }

  public async peopleSearch(searchTerm: string): Promise<IUser[]> {
    try {
      //const site = Site(siteUrl);
      let people: IUser[] = [];
      const searchResults: SearchResults = await sp.search(<ISearchQuery>{
        Querytext: searchTerm,
        RowLimit: 10,
        EnableInterleaving: true,
        SourceId: 'B09A7990-05EA-4AF9-81EF-EDFAB16C4E31',
        SelectProperties: PEOPLE_SEARCH_SELECT_PROPERTIES
      });
      
      people = searchResults.PrimarySearchResults.map(searchResult => {
        return <IUser>{
          text: searchResult['PreferredName'],
          imageUrl: searchResult['PictureURL'],
          secondaryText: searchResult['JobTitle'],
          email: searchResult['WorkEmail'],
          accountName: searchResult['AccountName']
        };
      });

      return people;
    }
    catch (error) {
      console.warn(error);
    }
  }

  public async getUserIdByAccountName(siteUrl: string, accountName: string): Promise<{ id: number, accountName: string }> {
    try {
      const site = Site(siteUrl);
      //const user = await site.rootWeb.siteUsers.getByEmail(username).get();
      const ensureUserResult = await site.rootWeb.ensureUser(accountName); //siteUsers.getByEmail(username).get();
      const user = await ensureUserResult.user.get();
      if (user) {
        return {
          id: user.Id,
          accountName: accountName
        };
      }
      return null;
    }
    catch (error) {
      console.warn(error);
    }
  }
}