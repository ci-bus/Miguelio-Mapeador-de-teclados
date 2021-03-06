/*
  Kmm.cpp

  Free to use
*/

#include "Kmm.h"

#if defined(_USING_HID)

static const uint8_t _hidReportDescriptor[] PROGMEM = {
  
  //  Kmm
    0x05, 0x0c,                    //	Usage Page (Consumer Devices)
    0x09, 0x01,                    //	Usage (Consumer Control)
    0xa1, 0x01,                    //	Collection (Application)
    0x85, 0x04,                    //	REPORT_ID (4)
    0x15, 0x00,                    //	Logical Minimum (0)
    0x25, 0x01,                    //	Logical Maximum (1)
    0x09, 0xe9,                    //	Usage (Volume Up)
    0x09, 0xea,                    //	Usage (Volume Down)
    0x75, 0x01,                    //	Report Size (1)
    0x95, 0x02,                    //	Report Count (2)
    0x81, 0x06,                    //	Input (Data, Variable, Relative)

    0x09, 0xe2,                    //	Usage (Mute)
    0x95, 0x01,                    //	Report Count (1)
    0x81, 0x06,                    //	Input (Data, Variable, Relative)

    0x09, 0xb0,                    //	Usage (Play)
    0x95, 0x01,                    //	Report Count (1)
    0x81, 0x06,                    //	Input (Data, Variable, Relative)

    0x09, 0xb1,                    //	Usage (Pause)
    0x95, 0x01,                    //	Report Count (1)
    0x81, 0x06,                    //	Input (Data, Variable, Relative)

    0x09, 0xb7,                    //	Usage (Stop)
    0x95, 0x01,                    //	Report Count (1)
    0x81, 0x06,                    //	Input (Data, Variable, Relative)

    0x09, 0xb5,                    //	Usage (Next)
    0x95, 0x01,                    //	Report Count (1)
    0x81, 0x06,                    //	Input (Data, Variable, Relative)

    0x09, 0xb6,                    //	Usage (Previous)
    0x95, 0x01,                    //	Report Count (1)
    0x81, 0x06,                    //	Input (Data, Variable, Relative)

    0x09, 0xb3,                    //	Usage (Fast Forward)
    0x95, 0x01,                    //	Report Count (1)
    0x81, 0x06,                    //	Input (Data, Variable, Relative)

    0x09, 0xb4,                    //	Usage (Rewind)
    0x95, 0x01,                    //	Report Count (1)
    0x81, 0x06,                    //	Input (Data, Variable, Relative)

    0x95, 0x06,                    //	Report Count (6) Number of bits remaining in byte
    0x81, 0x07,                    //	Input (Constant, Variable, Relative) 
    0xc0                           //	End Collection
};

//================================================================================
//================================================================================
//	Kmm

Kmm_::Kmm_(void)
{
    static HIDSubDescriptor node(_hidReportDescriptor, sizeof(_hidReportDescriptor));
    HID().AppendDescriptor(&node);
}

void Kmm_::begin(void) 
{
}

void Kmm_::end(void) 
{
}

void Kmm_::press(uint8_t key)
{
	uint8_t m[2];
	m[0] = key;
	m[1] = 0;
	HID().SendReport(4,m,2);
}

void Kmm_::increase(void)
{
	uint8_t m[2];
	m[0] = VOLUME_UP;
	m[1] = 0;
	HID().SendReport(4,m,2);
}
 
void Kmm_::decrease(void)
{
	uint8_t m[2];
	m[0] = VOLUME_DOWN;
	m[1] = 0;
	HID().SendReport(4,m,2);
}
 
void Kmm_::mute(void)
{
	uint8_t m[2];
	m[0] = VOLUME_MUTE;
	m[1] = 0;
	HID().SendReport(4,m,2);
}
 
void Kmm_::play(void)
{
	uint8_t m[2];
	m[0] = REMOTE_PLAY;
	m[1] = 0;
	HID().SendReport(4,m,2);
}
 
void Kmm_::pause(void)
{
	uint8_t m[2];
	m[0] = REMOTE_PAUSE;
	m[1] = 0;
	HID().SendReport(4,m,2);
}
 
void Kmm_::stop(void)
{
	uint8_t m[2];
	m[0] = REMOTE_STOP;
	m[1] = 0;
	HID().SendReport(4,m,2);
}
 
void Kmm_::next(void)
{
	uint8_t m[2];
	m[0] = REMOTE_NEXT;
	m[1] = 0;
	HID().SendReport(4,m,2);
}
 
void Kmm_::previous(void)
{
	uint8_t m[2];
	m[0] = REMOTE_PREVIOUS;
	m[1] = 0;
	HID().SendReport(4,m,2);
}
 
void Kmm_::forward(void)
{
	uint8_t m[2];
	m[0] = 0;
	m[1] = REMOTE_FAST_FORWARD >> 8;
	HID().SendReport(4,m,2);
}
 
void Kmm_::rewind(void)
{
	uint8_t m[2];
	m[0] = 0;
	m[1] = REMOTE_REWIND >> 8;
	HID().SendReport(4,m,2);
}
 
void Kmm_::clear(void)
{
	uint8_t m[2];
	m[0] = 0;
	m[1] = 0;
	HID().SendReport(4,m,2);
}

Kmm_ Kmm;

#endif
