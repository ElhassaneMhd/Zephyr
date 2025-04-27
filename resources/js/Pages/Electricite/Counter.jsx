import { Heading } from '@/components/Heading';
import Tabs from '@/components/ui/Tabs';
import { useNavigate, useUser } from '@/hooks';
import { TableLayout } from '@/layouts/TableLayout';
import { formatDate, getFirstOfCurrentMonthAtMidnight, getIsoDate } from '@/utils/helpers';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { MdHistory } from 'react-icons/md';
import { History } from './History';
import { Label } from '@/components/ui/InputField';
import { DropDown } from '@/components/ui';
import { FaPlus } from 'react-icons/fa6';

const resourceName = 'Record';
const routeName = '/electricite';

export default function Counter({ type, tables, history }) {
  const [current, setCurrent] = useState(tables ? Object.keys(tables)[0] : null);
  const { user } = useUser();
  const { navigate } = useNavigate();

  const formDefaults = {
    table_name: current,
    name: '',
    prev_date: '',
    prev_index: 0,
    date: getFirstOfCurrentMonthAtMidnight(),
    index: 0,
    consummation: 0,
    ...(type === 'general' && {
      puissance: 0,
      cos: 0,
    }),
  };

  return (
    <>
      <Head title={`Electricite | Compteur ${type === 'general' ? 'General' : 'Divisionnel'}`} />
      <div className='flex items-center justify-between gap-6'>
        <Heading>Compteur {type === 'general' ? 'General' : 'Divisionnel'}</Heading>
        {current && <Tabs tabs={Object.keys(tables).sort()} onChange={(v) => setCurrent(v)} />}
      </div>
      <TableLayout
        routeName={routeName}
        resourceName={resourceName}
        data={tables?.[current] || []}
        columns={[
          {
            key: 'name',
            displayLabel: 'ID',
            visible: true,
            type: 'number',
          },
          {
            key: 'date',
            displayLabel: 'Date',
            visible: true,
            type: 'date',
            format: (val) => formatDate(val, true),
          },
          {
            key: 'index',
            displayLabel: 'Index',
            visible: true,
            type: 'number',
          },
          {
            key: 'consummation',
            displayLabel: 'Consommation',
            visible: true,
            type: 'number',
          },
          ...(type === 'general'
            ? [
                {
                  key: 'puissance',
                  displayLabel: 'Puissance',
                  visible: true,
                  type: 'number',
                },
                {
                  key: 'cos',
                  displayLabel: 'COS Phi',
                  visible: true,
                  type: 'number',
                },
              ]
            : []),
        ]}
        formFields={[
          {
            name: 'table_name',
            customComponent: <TableNames />,
            visible: (type) => type === 'create',
          },
          {
            name: 'name',
            label: 'Name',
            parentClassName: 'col-span-2',
            showIcon: false,
            readOnly: (type) => type === 'update',
          },
          {
            name: 'prev_date',
            label: 'Date Precedant',
            type: 'datetime-local',
            readOnly: true,
            showIcon: false,
            visible: (type) => type === 'update',
          },
          {
            name: 'date',
            label: 'Date',
            type: 'datetime-local',
            showIcon: false,
            parentClassName: (type) => (type === 'create' ? 'col-span-2' : ''),
          },
          {
            name: 'prev_index',
            label: 'Index Precedant',
            type: 'number',
            step: '.01',
            readOnly: (type) => type === 'update',
          },
          {
            name: 'index',
            label: 'Index',
            type: 'number',
            min: 0,
            rules: { min: { value: 0, message: 'Index cannot be less than 0' } },
            step: '.01',
          },
          {
            name: 'consummation',
            label: 'Consommation',
            type: 'number',
            step: '.01',
            parentClassName: 'col-span-2',
            readOnly: true,
            format: (val) => Number(parseFloat(val).toFixed(2)),
            calculate: (values) => values.index - values.prev_index,
          },
          ...(type === 'general'
            ? [
                {
                  name: 'puissance',
                  label: 'Puissance',
                  type: 'number',
                  min: 0,
                  rules: { min: { value: 0, message: 'Puissance cannot be less than 0' } },
                },
                {
                  name: 'cos',
                  label: 'COS Phi',
                  type: 'number',
                  step: '.0001',
                  min: 0,
                  max: 1,
                  rules: {
                    min: { value: 0, message: 'COS Phi cannot be less than 0' },
                    max: { value: 1, message: 'COS Phi cannot be greater than 1' },
                  },
                },
              ]
            : []),
        ]}
        formDefaults={formDefaults}
        // hack
        updateDefaultValues={(row) => {
          return {
            id: row.id,
            ...formDefaults,
            name: row.name,
            prev_date: getIsoDate(row.date).toFormat("yyyy-MM-dd'T'HH:mm:ss"),
            prev_index: row.index,
            consummation: (row.prev_index ?? 0) - row.index,
            date: getFirstOfCurrentMonthAtMidnight(),
          };
        }}
        fieldsToSearch={['name']}
        selectedOptions={{
          deleteOptions:
            user.role === 'superAdmin'
              ? {
                  resourceName,
                  onConfirm: (ids) => {
                    navigate({
                      url: `${routeName}/multiple/destroy`,
                      method: 'POST',
                      data: { ids },
                    });
                  },
                }
              : null,
        }}
        canView={(data) => navigate({ url: `/row/${type}/${data.id}/history` })}
        layoutOptions={{
          actions: (def) => [
            {
              text: 'History',
              icon: <MdHistory />,
              onClick: (row) => navigate({ url: `/row/${type}/${row.id}/history` }),
            },
            ...(user.role === 'superAdmin' ? [def.edit, def.delete] : []),
            ...(['superAdmin', 'admin'].includes(user.role)
              ? [{ text: 'New Saisie', icon: <FaPlus />, onClick: def.edit.onClick, placement: 'outside' }]
              : []),
          ],
          displayNewRecord: user.role=== 'superAdmin',
        }}
        onAdd={(row) => {
          if (user.role !== 'superAdmin') return;
          const { name, date, index, consummation, puissance, cos } = row;
          navigate({
            url: `${routeName}/store`,
            method: 'POST',
            data: {
              name,
              date,
              index,
              consummation,
              ...(type === 'general' && { puissance, cos }),
              table_name: current,
              centre_id: user.mainCentre.id,
              counter: type,
            },
          });
        }}
        onUpdate={(row) => {
          if (user.role !== 'superAdmin') return;
          navigate({
            url: `${routeName}/update/${row.id}`,
            method: 'PUT',
            data: row,
          });
        }}
      />
      <History history={history} onClose={() => navigate({ url: `${routeName}/${type}` })} />
    </>
  );
}

function TableNames({ getValue, onChange, errorMessage }) {
  const tables = ['Appartement', 'Club', 'Hotel'];

  return (
    <div className='col-span-2 flex flex-col gap-1.5'>
      <Label label='Table Name' message={errorMessage} />
      <DropDown
        toggler={
          <DropDown.Toggler>
            <span className='capitalize'>
              {(getValue('table_name') && getValue('table_name')) || 'Choose a table name'}
            </span>
          </DropDown.Toggler>
        }
        options={{
          className: 'overflow-auto max-h-[300px] w-[230px]',
          shouldCloseOnClick: false,
        }}
      >
        {tables.map((t) => (
          <DropDown.Option
            key={t}
            onClick={() => onChange(t)}
            className='capitalize'
            isCurrent={t === getValue('table_name') && getValue('table_name')}
          >
            {t}
          </DropDown.Option>
        ))}
      </DropDown>
    </div>
  );
}
