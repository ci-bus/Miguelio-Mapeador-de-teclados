/*
  Kmm.h

  Free to use

*/

#ifndef KMM_h
#define KMM_h

#include "HID.h"

#if !defined(_USING_HID)

#warning "Using legacy HID core (non pluggable)"

#else

//================================================================================
//================================================================================
//  Kmm

#define REMOTE_CLEAR 0
#define VOLUME_UP 1
#define VOLUME_DOWN 2
#define VOLUME_MUTE 3
#define REMOTE_PLAY 4
#define REMOTE_PAUSE 5
#define REMOTE_STOP 6
#define REMOTE_NEXT 7
#define REMOTE_PREVIOUS 8
#define REMOTE_FAST_FORWARD 9
#define REMOTE_REWIND 10

class Kmm_
{
private:
public:
	Kmm_(void);
	void begin(void);
	void end(void);

    // Press and release keys
    void press(void);
 
	// Volume
	void increase(void);
	void decrease(void);
	void mute(void);
 
	// Playback
	void play(void);
	void pause(void);
	void stop(void);
 
	// Track Controls
	void next(void);
	void previous(void);
	void forward(void);
	void rewind(void);
 
	// Send an empty report to prevent repeated actions
	void clear(void);
};
extern Kmm_ Kmm;

#endif
#endif