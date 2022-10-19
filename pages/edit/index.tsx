import React, { useState } from 'react';
import Router, { useRouter } from 'next/router';

const Edit = () => {
  const router = useRouter();
  const { query } = router;
  const { postTitle, text, id, postID } = query;
  const [update, setUpdate] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleEdit = async () => {
    const data = {
      functionRole: 'editComment',
      postID,
      commentID: id,
      editedComment: update,
    };
    try {
      setUpdating(true);
      await fetch('/api/write-exm', {
        method: 'POST',
        body: JSON.stringify({ data }),
      });
      console.log('DATA', data);
      setUpdating(false);
      setUpdate('');
      Router.push(`/post/${postID}`);
    } catch (error) {}
  };

  return (
    <div>
      <div>
        <p>Community News: {postTitle}</p>
        <p>{text}</p>
      </div>

      <>
        <textarea
          name='comment'
          id='comment'
          cols={30}
          rows={10}
          value={update}
          placeholder=''
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setUpdate(e.target.value);
          }}
        ></textarea>

        <button onClick={handleEdit} disabled={!update}>
          {updating ? 'updating...' : 'update'}
        </button>
      </>
    </div>
  );
};

export default Edit;
