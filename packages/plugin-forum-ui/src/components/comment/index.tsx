import React from 'react';
import CommentForm from '../../components/comment/CommentForm';
import Comment from '../../containers/Comments/Comment';
import { IButtonMutateProps } from '@erxes/ui/src/types';
import { CommentSection } from '../../styles';

const CommentComponent: React.FC<{
  postId: string;
  renderButton: (props: IButtonMutateProps) => JSX.Element;
  error?: any;
  loading?: boolean;
  data: any;
  refetch: () => void;
}> = ({ postId, renderButton, error, loading, data, refetch }) => {
  const renderError = () => {
    if (error) {
      return <pre>Error occured</pre>;
    }

    return null;
  };

  const renderComment = () => {
    if (!loading && !error) {
      return (data.forumComments || []).map(c => (
        <Comment
          comment={c}
          renderButton={renderButton}
          key={c._id}
          onDeleted={refetch}
        />
      ));
    }

    return null;
  };
  return (
    <CommentSection>
      <CommentForm key={postId} postId={postId} renderButton={renderButton} />
      {renderError()}
      {renderComment()}
    </CommentSection>
  );
};

export default CommentComponent;
