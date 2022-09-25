import React from 'react';
import useArconnect from 'use-arconnect';
import Link from 'next/link';
import Router from 'next/router';
import useGetUser from '../hooks/useGetUser';

const Nav = () => {
  const arconnect = useArconnect(),
    { currentUser } = useGetUser(),
    navItems: Array<'new' | 'threads' | 'comments' | 'submit'> = [
      'new',
      'threads',
      'comments',
      'submit',
    ];

  return (
    <>
      <ul>
        {navItems.map((item: string, index) => (
          <li key={index}>
            <Link href={`/${item}`}>{item}</Link>
          </li>
        ))}
      </ul>

      <div>
        {currentUser.userName ? (
          <p style={{ marginLeft: '1rem' }}>{currentUser.userName}</p>
        ) : null}

        {arconnect === undefined ? (
          <button onClick={() => window.open('https://arconnect.io')}>
            Install ArConnect
          </button>
        ) : currentUser.userName && currentUser.walletAddress ? null : (
          <button onClick={() => Router.push('/connect')}>Connect</button>
        )}
      </div>
    </>
  );
};

export default Nav;
