import * as React from 'react';
import styles from './EditableLabel.module.scss';

interface IEditableLabelProps {
  value: any;
  displayValue?: any;
  label: string;
  type: 'text' | 'textarea' | 'date';
  placeholder?: string;
  children: React.ReactChild;
  childRef: React.MutableRefObject<any>;
  relatedFocusTarget?: string;
  onClickOutside: (value: any) => any;
}

const EditableLabel = (props: IEditableLabelProps) => {
  const { label, value, displayValue, type, placeholder, childRef, children, onClickOutside, relatedFocusTarget } = props;
  const [isEditing, setEditing] = React.useState(false);

  const labelRef: React.MutableRefObject<HTMLDivElement> = React.useRef();

  function handleLoseFocus(event, newValue, relatedFocusTarget?) {
    if (!relatedFocusTarget) {
      setEditing(false);
      onClickOutside(newValue);
    }
    else {
      const relatedFocusElement = document.querySelector(relatedFocusTarget);
      if (!relatedFocusElement || (relatedFocusElement && !relatedFocusElement.contains(event.target))) {
        setEditing(false);
        onClickOutside(newValue);
      }
    }
  }

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (labelRef.current && !labelRef.current.contains(event.target)) {
        handleLoseFocus(event, value, relatedFocusTarget);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [labelRef, value, handleLoseFocus, relatedFocusTarget]);

  React.useEffect(() => {
    if (childRef && childRef.current && isEditing === true) {
      childRef.current.focus();
    }
  }, [isEditing, childRef]);

  /* const handleKeyDown = (event, type) => {
    const { key } = event;
    const keys = ["Escape", "Tab"];
    const enterKey = "Enter";
    const allKeys = [...keys, enterKey];
    if (
      (type === "textarea" && keys.indexOf(key) > -1) ||
      (type !== "textarea" && allKeys.indexOf(key) > -1)
    ) {
      setEditing(false);
      onBlur();
    }
  }; */

  return (
    <section className={styles.editableLabel} {...props}>
      {isEditing ? 
        <>
          <div
            ref={labelRef}
            /* onBlur={(event) => {
              // If user clicked on no blur target, don't do anything
              if (relatedFocusTarget) {
                const noBlurElement = document.querySelector(relatedFocusTarget);
                if (noBlurElement && noBlurElement.contains(event.relatedTarget as Node)) {
                  return;
                }
              }
              if (!labelRef.current.contains(event.relatedTarget as Node)) {
                setEditing(false);
                onBlur();
              }
            }} */
            /* onKeyDown={e => handleKeyDown(e, type)} */
          >
            { children }
          </div>
        </>
        : 
        <>
          <div className={styles.viewLabel}>
            <label>{ label }</label>
            <div className={styles.value} onClick={() => setEditing(true)}>
              <span>{ (displayValue ? displayValue : value) || placeholder }</span>
            </div>
          </div>
        </>
      }
    </section>
  );
};

export default EditableLabel;