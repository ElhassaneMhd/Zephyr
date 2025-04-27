import { useUser } from '@/hooks/useUser';
import { DropDown } from './ui';
import { useNavigate } from '@/hooks';
import { FaCity } from 'react-icons/fa6';

export default function AppBar() {
  const { navigate } = useNavigate();
  const { user } = useUser();
  const { name, role, centres, mainCentre } = user || {};

  function getRoleLabel(role) {
    if (role === 'superAdmin') return 'Super Admin';
    if (role === 'admin') return 'Admin';
    return 'User';
  }

  return (
    <div className='flex items-center justify-between gap-8 px-6 py-3'>
      <div className='flex items-center gap-3'>
        <div className='grid h-9 w-9 place-content-center rounded-full border border-border bg-secondary text-lg font-bold text-white'>
          {name[0]}
        </div>
        <div className='flex flex-col text-start'>
          <span className='text-sm font-semibold capitalize text-text-primary'>{`${name}`}</span>
          <span className='text-xs font-medium capitalize text-text-tertiary'>{getRoleLabel(role)}</span>
        </div>
      </div>
      {role === 'superAdmin' ? (
        <div>
          {Array.isArray(centres) && centres.length > 0 ? (
            <DropDown
              toggler={
                <DropDown.Toggler>
                  <FaCity />
                  {mainCentre.name}
                </DropDown.Toggler>
              }
              togglerClassName='w-fit gap-2'
            >
              {centres.map((el) => (
                <DropDown.Option
                  key={el.id}
                  className='justify-center'
                  isCurrent={mainCentre.id === el.id}
                  onClick={() =>
                    navigate({
                      url: `/centres/${el.id}/access`,
                      method: 'POST',
                    })
                  }
                >
                  {el.name}
                </DropDown.Option>
              ))}
            </DropDown>
          ) : (
            <span className='text-sm font-medium capitalize text-text-secondary'>{mainCentre.name}</span>
          )}
        </div>
      ) : (
        <span className='text-sm font-medium capitalize text-text-secondary'>{mainCentre.name}</span>
      )}
    </div>
  );
}
