import axios from 'axios';
import { PermissionType } from 'arconnect';
import React, { useState, useEffect } from 'react';
import useWalletAddress from '../hooks/useWalletAddress';
import Router from 'next/router';
import useGetUser from '../hooks/useGetUser';

const Connect = () => {
  const [allUsers, setAllUsers] = useState([]),
    [userName, setUserName] = useState(''),
    user = useGetUser();

  const walletAddress = useWalletAddress();

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        const response = await fetch('/api/allPosts');
        const getPosts = await response.json();
        const { users } = getPosts.data;
        setAllUsers(users);
      } catch (error) {
        console.error(error);
      }
    };

    getAllUsers();
  }, []);

  const allUserNames = allUsers.map(
    (user: { walletAddress: string; userName: string }) => {
      if (allUsers.length > 0) {
        return user.userName;
      }
    }
  );

  const validateUserNameFormat = () => /^[a-z0-9_]+$/i.test(userName);
  const validateUsername = () => !userName || allUserNames.includes(userName);

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    setUserName(e.currentTarget.value);
  };

  const login = async () => {
    try {
      const arConnectPermissions: PermissionType[] = [
        'ACCESS_ADDRESS',
        'ACCESS_ALL_ADDRESSES',
        'SIGN_TRANSACTION',
      ];
      await window.arweaveWallet.connect(arConnectPermissions, {
        name: 'CommunityLabs News',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const connectWallet = async () => {
      try {
        await login();
      } catch (error) {
        console.error(error);
      }
    };

    const postUser = async () => {
      try {
        const address = await window.arweaveWallet.getActiveAddress();
        await axios.post('/api/connect', {
          input: {
            functionRole: 'addUser',
            walletAddress: address,
            userName: userName.toLowerCase(),
          },
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (!walletAddress) {
      await connectWallet();
      await postUser();
      Router.push('/');
    }
  };

  return (
    <>
      <h1>Connect your ArConnect Wallet</h1>

      {userName.length === 0 ? null : validateUsername() ? (
        <p>username not available</p>
      ) : !validateUserNameFormat() ? (
        <p>wrong format. use digits, numbers or underscore</p>
      ) : (
        <p>username available</p>
      )}

      {walletAddress ? (
        <h4>your Arconnect wallet is already connected to Community News</h4>
      ) : (
        <form action='' onSubmit={handleSubmit}>
          <label>
            username:
            <input
              value={userName}
              onChange={handleChange}
              style={{
                border: `${
                  allUserNames.includes(userName)
                    ? '1.5px solid red'
                    : '1.5px solid gray'
                }`,
                outline: 'none',
              }}
            />
          </label>

          <button disabled={validateUsername()}>Connect</button>
        </form>
      )}
    </>
  );
};

export default Connect;

// todo - username must have 3 or more characters
