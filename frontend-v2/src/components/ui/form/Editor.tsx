import { useMemo, useState } from 'react';
import { Descendant, createEditor } from 'slate';
import { Editable, Slate, withReact } from 'slate-react';
import { htmlToSlate } from 'slate-serializers';
import { UserContent } from '../elements/UserContent';

export interface EditorProps {
  initialValue?: string;
  placeholder?: string;
  forceSave?: boolean;
  onSave?: (value: string) => unknown;
}

export const Editor = ({
  initialValue = '',
  placeholder = 'Start writing',
  forceSave = false,
  onSave,
}: EditorProps) => {
  const [editor] = useState(() => withReact(createEditor()));
  const [dirty, setDirty] = useState(false);

  const parsedValue = useMemo(() => {
    let value: Descendant[] = [];

    try {
      if (!initialValue) throw new Error();
      value = JSON.parse(initialValue);
    } catch {
      if (!initialValue || initialValue.length < 1) {
        initialValue = `<p></p>`;
      }
      value = htmlToSlate(initialValue);
    }

    if (value.length < 1) {
      value.push({ text: '' });
    }

    return value;
  }, [initialValue]);

  const [currentValue, setCurrentValue] = useState('');

  const handleOnSave = () => {
    console.log(currentValue);
    onSave?.(currentValue);
  };

  return (
    <>
      <UserContent>
        <Slate
          onChange={value => {
            setDirty(true);
            setCurrentValue(JSON.stringify(value));
          }}
          value={parsedValue}
          editor={editor}
        >
          <Editable placeholder={placeholder} />
        </Slate>
      </UserContent>

      {(forceSave || dirty) && (
        <div className="mt-5 flex justify-end items-center py-4">
          <button className="text-white bg-violet-700 md:w-48" onClick={handleOnSave}>
            Save
          </button>
        </div>
      )}
    </>
  );
};
