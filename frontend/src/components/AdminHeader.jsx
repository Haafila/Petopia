import React, { Fragment, useEffect, useState } from 'react';
import { HiOutlineBell, HiOutlineChatAlt, HiOutlineSearch } from 'react-icons/hi';
import { Popover, Transition } from '@headlessui/react';

export default function AdminHeader() {
  const [session, setSession] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/user', {
          credentials: 'include', // Required for cookies
        });
        const data = await response.json();
        console.log('Session data:', data); // Debug log
        setSession(data);
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };
    fetchSession();
  }, []);

  return (
    <div className='h-20 px-4 flex justify-between items-center border-b border-gray-200' style={{ backgroundColor: 'var(--background-light)' }}>
      <div className='flex items-center gap-4'>
        <div>
          <img src="../assets/logo-no-title.png" alt="" width="30%" />
        </div>
        <div className='text-2xl text-gray-600 font-bold'>
          Welcome, <span className='font-black text-rose-400'>{session.name}</span>!
        </div>
      </div>

      {/* Right Section: Search Bar, Notification, and Message Icons */}
      <div className='flex items-center gap-4'>
        {/* Search Bar */}
        <div className='relative'>
          <HiOutlineSearch fontSize={20} className='text-gray-400 absolute top-1/2 -translate-y-1/2 left-3' />
          <input
            type='text'
            placeholder='Search'
            className='text-sm focus:outline-none h-10 w-[24rem] border border-gray-300 rounded-sm pl-11 pr-4'
          />
        </div>

        {/* Message Icon */}
        <Popover className='relative'>
          {({ open }) => (
            <>
              <Popover.Button className='p-1.5 rounded-sm inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100'>
                <HiOutlineChatAlt fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <Popover.Panel className='absolute right-0 z-10 mt-2.5 w-80'>
                  <div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                    <strong className='text-gray-700 font-medium'>Messages</strong>
                    <div className='mt-2 py-1 text-sm'>This is the message panel.</div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>

        {/* Notification Icon */}
        <Popover className='relative'>
          {({ open }) => (
            <>
              <Popover.Button className='p-1.5 rounded-sm inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100'>
                <HiOutlineBell fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <Popover.Panel className='absolute right-0 z-10 mt-2.5 w-80'>
                  <div className='bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5'>
                    <strong className='text-gray-700 font-medium'>Notifications</strong>
                    <div className='mt-2 py-1 text-sm'>This is the notification panel.</div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
}