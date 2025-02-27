import { useTable } from './useTable';
import { BsTable, BsListCheck } from 'react-icons/bs';
import { Button, CheckBox, DropDown } from '@/components/ui';

export function View() {
  const { columns, onChangeView, data,  disabled } = useTable();

  if ( data?.length === 0) return null;

  return (
    <DropDown
      toggler={
        <Button shape='icon'>
          <BsTable />
        </Button>
      }
      options={{ className: 'max-h-[300px] overflow-auto', shouldCloseOnClick: false }}
      togglerDisabled={disabled}
    >
      <DropDown.Option
        onClick={() => onChangeView(null, true)}
        disabled={columns.filter((c) => c.visible).length === columns.length}
      >
        <BsListCheck />
        Check All
      </DropDown.Option>
      <DropDown.Divider />

      {columns.map(({ key,displayLabel, visible }) => {
        const disabled = visible && columns.filter((c) => c.visible).length === 1;

        return (
          <DropDown.Option key={key} className='justify-between' disabled={disabled}>
            {displayLabel}
            <CheckBox checked={visible} onChange={() => onChangeView(displayLabel)} disabled={disabled} />
          </DropDown.Option>
        );
      })}
    </DropDown>
  );
}
