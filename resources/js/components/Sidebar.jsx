import { useEffect, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  BsLayoutSidebarInset,
  BsLayoutSidebarInsetReverse,
  FiLogOut,
  IoChevronDownOutline,
  IoWaterOutline,
  LiaFireSolid,
  MdElectricBolt,
  MdOutlineEnergySavingsLeaf,
  RiGasStationLine,
  HiOutlineUsers,
} from './ui/Icons';

import { Button } from './ui';
import { ThemeToggler } from './ThemeToggler';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { useConfirmationModal, useNavigate, useUser } from '@/hooks';
import { Logo } from './ui/Logo';

const routes = [
  {
    icon: <MdElectricBolt />,
    label: 'Électricité',
    sub: [
      { label: 'Compteur General', href: '/electricite/general' },
      { label: 'Compteur Divisionnel', href: '/electricite/divisional' },
    ],
  },
  {
    icon: <IoWaterOutline />,
    label: 'Eau',
    sub: [
      { label: 'Compteur General', href: '/eau/general' },
      { label: 'Compteur Divisionnel', href: '/eau/divisional' },
    ],
  },
  { icon: <RiGasStationLine />, label: 'Carburant', href: '/carburant' },
  {
    icon: <LiaFireSolid />,
    label: 'Gaz',
    href : '/gaz'
  },
  {
    icon: <MdOutlineEnergySavingsLeaf />,
    label: 'Biomasse',
    href: '/biomasse',
  },
];

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(window.matchMedia('(min-width: 1024px)').matches);
  const { navigate } = useNavigate();
  const { openModal } = useConfirmationModal();
  const { user } = useUser();
  useEffect(() => {
    const onresize = () => setIsExpanded(window.matchMedia('(min-width: 1024px)').matches);

    window.addEventListener('resize', onresize);

    return () => window.removeEventListener('resize', onresize);
  }, [isExpanded]);

  return (
    <aside
      className={`fixed top-0 z-[15] row-span-2 flex h-full flex-col gap-8 bg-background-secondary pb-2 pt-3 transition-[width] duration-500 md:relative ${
        isExpanded ? 'w-full overflow-hidden px-3 md:w-[280px]' : 'w-14 px-2'
      }`}
    >
      <div className='z-20 flex items-center justify-between'>
        <div className={isExpanded ? 'w-20 flex-1 scale-100' : 'h-0 w-0 scale-0'}>
          <Logo />
        </div>
        <Button
          shape='icon'
          className={`not-active self-center ${isExpanded ? '' : 'mx-auto'}`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <BsLayoutSidebarInset /> : <BsLayoutSidebarInsetReverse />}
        </Button>
      </div>
      <ul className={`relative space-y-1.5 overflow-y-auto overflow-x-hidden ${isExpanded ? 'pr-2' : 'no_scrollbar'}`}>
        {routes.map((route) => (
          <SidebarElement key={route.label} {...route} isExpanded={isExpanded} />
        ))}
      </ul>

      <div className='mt-auto'>
        <div className={`flex items-center gap-2 ${isExpanded ? '' : 'flex-col'}`}>
          <ThemeToggler layout={isExpanded ? 'long' : ''} />
          {user.role === 'superAdmin' && (
            <Button
              shape='icon'
              onClick={() => {
                navigate({ url: '/users' });
              }}
            >
              <HiOutlineUsers className='text-text-tertiary' />
            </Button>
          )}
          <Button
            shape='icon'
            onClick={() => {
              openModal({
                message: 'You are about to log out. Do you wish to proceed?',
                title: 'Logout',
                confirmText: 'Logout',
                onConfirm: () =>
                  navigate({
                    url: '/logout',
                    method: 'POST',
                  }),
              });
            }}
          >
            <FiLogOut className='text-text-tertiary' />
          </Button>
        </div>
      </div>
    </aside>
  );
}

function SidebarElement({ icon, label, href, sub, isExpanded }) {
  const [isOpen, setIsOpen] = useState(true);
  const { url } = usePage();
  const [parent] = useAutoAnimate();

  const spanClass = `transition-transform origin-left duration-500 text-sm text-text-secondary ${
    isExpanded ? 'md:scale-100' : 'scale-0'
  }`;

  if (sub) {
    return (
      <li ref={parent}>
        <button className='sidebar-element group w-full grid-cols-[30px_auto_20px]' onClick={() => setIsOpen(!isOpen)}>
          {icon}
          <span className={spanClass}>{label}</span>
          <IoChevronDownOutline
            className={`ml-auto transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          />
        </button>
        {isOpen && isExpanded && (
          <ul className='relative ml-5 mt-1 space-y-1 overflow-y-auto overflow-x-hidden border-l border-border pl-2'>
            {sub.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={`sidebar-element group ${url === href ? 'active' : ''}`}>
                  <span className={spanClass}>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        href={sub ? null : href}
        className={`sidebar-element group grid-cols-[30px_auto] ${url === href ? 'active' : ''}`}
      >
        {icon}
        <span className={spanClass}>{label}</span>
      </Link>
    </li>
  );
}
