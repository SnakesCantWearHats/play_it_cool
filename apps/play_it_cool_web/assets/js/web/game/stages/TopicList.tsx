import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { FETCH_TOPICS, Topic } from '../queries';
import List from '../../../components/List';
import { useDispatch, useSelector } from 'react-redux';
import { startGame } from '../actions';
import { IRootStore } from '../../../shared/store';
import { makeStyles } from '@material-ui/styles';
import { ITheme } from '../../../shared/theme';

const useStyle = makeStyles((theme: ITheme) => ({
  title: {
    color: theme.palette.white,
    '@media screen and (max-width: 800px)': {
      fontSize: '1rem',
    },
  },
}));

interface ITopicListProps {
  nextStage: () => void;
}

const TopicList: React.FC<ITopicListProps> = ({ nextStage }) => {
  const { data, loading }: { data: { subjects: Topic[] } | undefined; loading: boolean } = useQuery(
    FETCH_TOPICS
  );
  const dispatch = useDispatch();
  const channel = useSelector((store: IRootStore) => store.game.channel);
  const wordReceived = useSelector((state: IRootStore) => state.game.wordReceived);
  const classes = useStyle();

  useEffect(() => {
    if (wordReceived) {
      nextStage();
    }
  }, [wordReceived]);

  const generateItemList = (topics: Topic[] | undefined) => {
    if (!topics) {
      return [];
    }
    return topics.map((topic) => ({
      key: topic.id,
      label: topic.label,
      onClick: () => dispatch(startGame(topic.label, channel)),
    }));
  };

  return (
    <>
      <div className={classes.title}>Choose a topic for this game</div>
      <List loading={loading} buttons itemList={generateItemList(data?.subjects)} />
    </>
  );
};

export default TopicList;
