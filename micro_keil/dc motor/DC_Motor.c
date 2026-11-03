./*
	Program For DC Motor Card Interfacing with SST89E516RD
	
	Company :- Logsun System
	Author  :- Rupesh Khatpe
	
	Function    S1= START
							S2= STOP
							S3= Forward
							S4= Reverse
							S5= Speed Increase
							S6= Speed Decrease
							
							I/P1=PWM1(CEX1,P1.4)
							I/P2=PWM2(CEX1,P1.5)
							
	connection details:- J2(PORT1)  To  J14 (DC MOTOR Card)	
											 J3(PORT2)  TO  J15(DC MOTOR Card)
*/

#include <reg51.h>

sbit EN1 =   P1^1;
sbit EN2 =   P1^6;

sbit DEC =   P2^3;   
sbit INC =   P2^2;    
sbit REV =   P2^1;   
sbit STOP =  P2^4;  
sbit START = P2^0;   

void delay(unsigned char val)
{
	unsigned int i,j;
	for(i=0;i<val;i++)
	for(j=0;j<100;j++);
}

void main()
{
	unsigned char M_ON,val1=0x20,val2=0x42,val3=0x00,val4=0x00,dir;	
	M_ON=0xcc;
	dir=2;
	P2=0xFF;
		while(1)
		{
			if(START==0 && M_ON==0xcc)
			{
				dir=0;
				M_ON=0;
				EN1=1;
				CCON=0x40;
				CMOD=0x00;	
				CCAP1H = val1;
				CCAPM1 = val2;
				CCAP2H = 0x00;
				CCAPM2 = val2;				
			}
			if(STOP==0 && ( M_ON==0x00 || M_ON==0xcc ))
			{
				dir=0;
				M_ON=0xcc;
				EN1=0;
				CCON=0x40;
				CMOD=0x00;	
				CCAP1H = 0x00;
				CCAPM1 = 0x00;
				CCAP2H = 0x00;
				CCAPM2 = 0x00;	
				val1=0x20;			
			}
			else if(REV==0 && M_ON==0)
			{
				dir=1;
				M_ON=0xcc;
				EN1=1;
				CCAP1H=0x00;
				CCAP2H=val1;
			}
			else if(INC==0 && ( M_ON==0 || M_ON==0xcc))
			{
				if(val1<0xf0)
					{
						val1 = val1+ 1;
						delay(30);	
					}
			}
			else if(DEC==0 && ( M_ON==0 || M_ON==0xcc))
				{		
					if(0x10<val1)
					{
						val1 = val1- 1;
						delay(30);	
					}
				}	
				if(dir==0)
				{
					CCAP1H=val1;
				}
				if(dir==1)
				{
					CCAP2H=val1;
				}
		}

	}
