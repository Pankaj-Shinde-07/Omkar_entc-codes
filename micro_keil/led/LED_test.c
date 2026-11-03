/* 
   Company Name:- Logsun Systems
   Author:- RUPESH KHATPE  
   Program For 8 Bit LED Logic
   connection details :-
											PORT0 :- J21(8 BIT LED LOGIC)
											PORT1 :- J22(8 BIT LED LOGIC)
*/
#include <reg51.h>

sbit LED0=P0^0;
sbit LED1=P0^1;
sbit LED2=P0^2;
sbit LED3=P0^3;
sbit LED4=P0^4;
sbit LED5=P0^5;
sbit LED6=P0^6;
sbit LED7=P0^7;

sbit sw0=P1^0;
sbit sw1=P1^1;
sbit sw2=P1^2;
sbit sw3=P1^3;
sbit sw4=P1^4;
sbit sw5=P1^5;
sbit sw6=P1^6;
sbit sw7=P1^7;

void main(void)
{
	P0=0x00;
	P1=0xff;	
	while(1)
	{
		if(sw0==1) LED0=1;
		else LED0=0;
		if(sw1==1) LED1=1;
		else LED1=0;
		if(sw2==1) LED2=1;
		else LED2=0;
		if(sw3==1) LED3=1;
		else LED3=0;
		if(sw4==1) LED4=1;
		else LED4=0;
		if(sw5==1) LED5=1;
		else LED5=0;
		if(sw6==1) LED6=1;
		else LED6=0;
		if(sw7==1) LED7=1;
		else LED7=0;
	}
}