import * as React from 'react';
import { IBasePickerSuggestionsProps, NormalPeoplePicker, IPersonaProps } from 'office-ui-fabric-react/lib';
import { IUser } from '../../models/IUser';
import { GanttService } from '../../services/GanttService';
import styles from './GanttPeoplePicker.module.scss';

const suggestionProps: IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggested People',
  mostRecentlyUsedHeaderText: 'Suggested Contacts',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: true,
  suggestionsAvailableAlertText: 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: 'Suggested contacts',
};

interface IPeoplePickerProps {
  label: string;
  value: IUser[];
  onSelected: (newPeople: IUser[]) => void;
}

const GanttPeoplePicker: React.FunctionComponent<IPeoplePickerProps> = (props: IPeoplePickerProps) => {
  const { label, value, onSelected } = props;

  const [currentSelectedItems, setCurrentSelectedItems] = React.useState<IUser[]>(value);
  const picker = React.useRef(null);

  const onFilterChanged = async (
    filterText: string,
    currentPersonas: IUser[],
    limitResults?: number,
  ): Promise<IUser[]> => {
    const ganttService = GanttService.getInstance();
    const personas = await ganttService.peopleSearch(filterText);
    let filteredPersonas = removeDuplicates(personas, currentPersonas);
    filteredPersonas = limitResults ? filteredPersonas.slice(0, limitResults) : filteredPersonas;
    return filteredPersonas;
  };

  const onItemsChange = (items: any[]): void => {
    setCurrentSelectedItems(items);
    onSelected(items);
  };

  return (
    <div className={styles.ganttPeoplePicker}>
      <label>{ label }</label>
      <div>
        <NormalPeoplePicker
          onResolveSuggestions={onFilterChanged}
          getTextFromItem={getTextFromItem}
          pickerSuggestionsProps={suggestionProps}
          className={'ms-PeoplePicker'}
          pickerCalloutProps={{
            className: styles.callout
          }}
          key={'controlled'}
          selectedItems={currentSelectedItems}
          onChange={onItemsChange}
          inputProps={{
            onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
            onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
          }}
          componentRef={picker}
          resolveDelay={300}
        />
      </div>
    </div>
  );
};

function removeDuplicates(personas: IUser[], possibleDupes: IUser[]) {
  return personas.filter(persona => !listContainsPersona(persona, possibleDupes));
}

function listContainsPersona(persona: IUser, personas: IUser[]) {
  if (!personas || !personas.length || personas.length === 0) {
    return false;
  }
  return personas.filter(item => item.id === persona.id).length > 0;
}

function getTextFromItem(persona: IUser): string {
  return persona.text as string;
}

export default GanttPeoplePicker;