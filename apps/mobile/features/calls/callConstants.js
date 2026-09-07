export const CALL_TYPES = {
  VOICE: 'voice',
  VIDEO: 'video',
};

export const CALL_STATUS = {
  IDLE: 'idle',
  CONNECTING: 'connecting',
  RINGING: 'ringing',
  ACTIVE: 'active',
  ENDED: 'ended',
  MISSED: 'missed',
  DECLINED: 'declined',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const CALL_ACTIONS = {
  START: 'start',
  ACCEPT: 'accept',
  DECLINE: 'decline',
  END: 'end',
  CANCEL: 'cancel',
  MUTE: 'mute',
  UNMUTE: 'unmute',
  CAMERA_ON: 'camera_on',
  CAMERA_OFF: 'camera_off',
  SPEAKER_ON: 'speaker_on',
  SPEAKER_OFF: 'speaker_off',
  SWITCH_CAMERA: 'switch_camera',
};

export const CALL_MEDIA = {
  AUDIO: 'audio',
  VIDEO: 'video',
};

export const CALL_ERRORS = {
  PERMISSION_DENIED: 'Required call permissions were denied.',
  CAMERA_PERMISSION_DENIED:
    'Camera permission is required for video calls.',
  MICROPHONE_PERMISSION_DENIED:
    'Microphone permission is required for calls.',
  INVALID_CALL_TYPE: 'Invalid call type.',
  INVALID_CALL_ID: 'Invalid call ID.',
  CALL_NOT_FOUND: 'Call not found.',
  CALL_ALREADY_ACTIVE: 'A call is already active.',
  CONNECTION_FAILED:
    'Unable to establish the call connection.',
  CALL_FAILED: 'The call could not be completed.',
};

export const CALL_DEFAULTS = {
  TYPE: CALL_TYPES.VOICE,
  MUTE: false,
  CAMERA_ENABLED: true,
  SPEAKER_ENABLED: false,
  FRONT_CAMERA: true,
};

export const CALL_LIMITS = {
  MAX_PARTICIPANTS: 50,
  MAX_CALL_HISTORY: 100,
};

export default {
  CALL_TYPES,
  CALL_STATUS,
  CALL_ACTIONS,
  CALL_MEDIA,
  CALL_ERRORS,
  CALL_DEFAULTS,
  CALL_LIMITS,
};