/**
 * WebRTC Service
 *
 * Handles audio/video calls using WebRTC.
 */

import { activeCalls, mediaSettings } from '../../stores/calls.ts';
import type { Call, CallType } from '../../types/media.ts';

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;

  /**
   * Initialize a call
   */
  async initiateCall(
    recipientJid: string,
    callType: CallType,
  ): Promise<Call> {
    try {
      // Get user media
      this.localStream = await this.getUserMedia(callType);

      // Create peer connection
      this.peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ],
      });

      // Add local stream tracks to peer connection
      this.localStream.getTracks().forEach((track) => {
        this.peerConnection?.addTrack(track, this.localStream!);
      });

      // Create call object
      const call: Call = {
        id: crypto.randomUUID(),
        type: callType,
        direction: 'outgoing' as any,
        state: 'initiating' as any,
        initiator: {
          full: '',
          bare: '',
          domain: '',
        },
        recipient: {
          full: recipientJid,
          bare: recipientJid,
          domain: '',
        },
        startTime: new Date(),
        localStream: this.localStream,
        peerConnection: this.peerConnection,
        isAudioMuted: false,
        isVideoDisabled: callType === 'audio',
        isRemoteAudioMuted: false,
        isRemoteVideoDisabled: false,
      };

      // Add to active calls
      activeCalls.update((calls) => {
        calls.set(call.id, call);
        return calls;
      });

      return call;
    } catch (error) {
      throw new Error(`Failed to initiate call: ${error}`);
    }
  }

  /**
   * Get user media (audio/video)
   */
  private async getUserMedia(callType: CallType): Promise<MediaStream> {
    let settings = {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
      videoFrameRate: 30,
    };
    const unsubscribe = mediaSettings.subscribe((s) => {
      settings = s;
    });
    unsubscribe();

    const constraints: MediaStreamConstraints = {
      audio: {
        echoCancellation: settings.echoCancellation,
        noiseSuppression: settings.noiseSuppression,
        autoGainControl: settings.autoGainControl,
      },
      video: callType === 'video'
        ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: settings.videoFrameRate },
        }
        : false,
    };

    return await navigator.mediaDevices.getUserMedia(constraints);
  }

  /**
   * Toggle audio mute
   */
  toggleAudio(callId: string): void {
    activeCalls.update((calls) => {
      const call = calls.get(callId);
      if (call && call.localStream) {
        const audioTracks = call.localStream.getAudioTracks();
        audioTracks.forEach((track) => {
          track.enabled = !track.enabled;
        });
        call.isAudioMuted = !call.isAudioMuted;
        calls.set(callId, call);
      }
      return calls;
    });
  }

  /**
   * Toggle video
   */
  toggleVideo(callId: string): void {
    activeCalls.update((calls) => {
      const call = calls.get(callId);
      if (call && call.localStream) {
        const videoTracks = call.localStream.getVideoTracks();
        videoTracks.forEach((track) => {
          track.enabled = !track.enabled;
        });
        call.isVideoDisabled = !call.isVideoDisabled;
        calls.set(callId, call);
      }
      return calls;
    });
  }

  /**
   * End call
   */
  endCall(callId: string): void {
    activeCalls.update((calls) => {
      const call = calls.get(callId);
      if (call) {
        // Stop local stream
        call.localStream?.getTracks().forEach((track) => track.stop());

        // Close peer connection
        call.peerConnection?.close();

        // Update call state
        call.state = 'ended' as any;
        call.endTime = new Date();
        if (call.startTime && call.endTime) {
          call.duration = Math.floor(
            (call.endTime.getTime() - call.startTime.getTime()) / 1000,
          );
        }

        calls.delete(callId);
      }
      return calls;
    });
  }
}

export const webrtcService = new WebRTCService();
