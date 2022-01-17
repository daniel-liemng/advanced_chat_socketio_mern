import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import MyChats from '../components/chat/MyChats';
import ChatBox from '../components/chat/ChatBox';
import SideDrawer from '../components/layout/SideDrawer';
import { ChatState } from '../context/ChatProvider';

const ChatPage = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}
      <Box
        d={'flex'}
        justifyContent={'space-between'}
        w={'100%'}
        h={'91.5vh'}
        p={'10px'}
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
