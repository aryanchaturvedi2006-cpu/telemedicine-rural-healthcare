import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';

const VideoCallRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleReadyToClose = () => {
    navigate(-1);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', backgroundColor: '#000' }}>
      <JitsiMeeting
        roomName={`TelemedicineRuralHealthcare_${id}`}
        configOverwrite={{
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableModeratorIndicator: true,
          enableEmailInStats: false
        }}
        interfaceConfigOverwrite={{
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_JITSI_WATERMARK: false,
          SHOW_PROMOTIONAL_CLOSE_PAGE: false,
        }}
        userInfo={{
          displayName: 'User'
        }}
        onApiReady={(externalApi) => {
          externalApi.addListener('readyToClose', handleReadyToClose);
          externalApi.addListener('videoConferenceLeft', handleReadyToClose);
        }}
        getIFrameRef={(iframeRef) => {
          iframeRef.style.height = '100%';
          iframeRef.style.width = '100%';
        }}
      />
    </div>
  );
};

export default VideoCallRoom;
