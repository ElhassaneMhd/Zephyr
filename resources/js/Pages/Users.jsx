import { Heading } from '@/components/Heading';
import { CheckBox, DropDown } from '@/components/ui';
import { Label } from '@/components/ui/InputField';
import { useNavigate, useUser } from '@/hooks';
import { TableLayout } from '@/layouts/TableLayout';
import { RULES } from '@/utils/constants';

export default function Users({ users }) {
  const resourceName = 'User';
  const { navigate } = useNavigate();
  const { user } = useUser();

  return (
    <>
      <div className='flex items-center justify-between gap-6'>
        <Heading>Users</Heading>
      </div>
      <TableLayout
        routeName='users'
        resourceName={resourceName}
        data={users || []}
        columns={[
          {
            key: 'name',
            displayLabel: 'Name',
            visible: true,
          },
          {
            key: 'email',
            displayLabel: 'Email',
            visible: true,
          },
          {
            key: 'centre',
            displayLabel: 'Center',
            visible: true,
            format: (value) => value.name,
          },
          {
            key: 'role',
            displayLabel: 'Role',
            visible: true,
            format: (value) => {
              const roles = [
                { value: 'superAdmin', label: 'Super Admin' },
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' },
              ];
              return roles.find((r) => r.value === value)?.label || '';
            },
          },
        ]}
        formFields={[
          {
            name: 'centre',
            customComponent: <Centers />,
          },
          {
            name: 'name',
            label: 'Name',
          },
          {
            name: 'email',
            type: 'email',
            label: 'Email Address',
          },
          {
            name: 'password',
            type: 'password',
            label: 'Password',
          },
          {
            name: 'password_confirmation',
            type: 'password',
            label: 'Confirm Password',
            rules: { ...RULES.passwordConfirmation },
          },
          {
            name: 'role',
            customComponent: <Roles />,
          },
        ]}
        formDefaults={{
          centre: '',
          name: '',
          email: '',
          password: '',
          password_confirmation: '',
          isSuperAdmin: 'false',
        }}
        fieldsToSearch={['name', 'email', 'centre']}
        layoutOptions={{ actions: (def) => (user.role === 'superAdmin' ? [def.edit, def.delete] : []) }}
        canView={false}
        onAdd={(data) => {
          if (user.role !== 'superAdmin') return;
          navigate({ url: 'users.store', method: 'POST', data: { ...data, centre_id: data.centre.id } });
        }}
        onUpdate={(data) => {
          if (user.role !== 'superAdmin') return;
          navigate({
            url: 'users.update',
            params: data.id,
            method: 'PUT',
            data: { ...data, centre_id: data.centre.id },
          });
        }}
      />
    </>
  );
}

function Centers({ getValue, onChange, errorMessage }) {
  const { user } = useUser();

  console.log(user);

  return (
    <div className='col-span-2 flex flex-col gap-1.5'>
      <Label label='Centre' message={errorMessage} />
      <DropDown
        toggler={
          <DropDown.Toggler>
            <span className='capitalize'>{(getValue('centre') && getValue('centre').name) || 'Choose a center'}</span>
          </DropDown.Toggler>
        }
        options={{
          className: 'overflow-auto max-h-[300px] w-[230px]',
          shouldCloseOnClick: false,
        }}
      >
        {user?.centres.map((c) => (
          <DropDown.Option
            key={c.id}
            onClick={() => onChange({ id: c.id, name: c.name })}
            className='capitalize'
            isCurrent={c.id === getValue('centre') && getValue('centre').id}
          >
            {c.name}
          </DropDown.Option>
        ))}
      </DropDown>
    </div>
  );
}

function Roles({ getValue, onChange, errorMessage }) {
  const roles = [
    { value: 'superAdmin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' },
  ];

  return (
    <div className='col-span-2 flex flex-col gap-1.5'>
      <Label label='Role' message={errorMessage} />
      <DropDown
        toggler={
          <DropDown.Toggler>
            <span className='capitalize'>
              {(getValue('role') && roles.find((r) => r.value === getValue('role')).label) || 'Choose a role'}
            </span>
          </DropDown.Toggler>
        }
        options={{
          className: 'overflow-auto max-h-[300px] w-[230px]',
          shouldCloseOnClick: false,
        }}
      >
        {roles.map(({ label, value }) => (
          <DropDown.Option
            key={value}
            onClick={() => onChange(value)}
            className='capitalize'
            isCurrent={value === getValue('role') && getValue('role')}
          >
            {label}
          </DropDown.Option>
        ))}
      </DropDown>
    </div>
  );
}
