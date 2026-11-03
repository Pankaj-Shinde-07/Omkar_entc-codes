/* 
  Company Name:- Logsun Systems
	PROGRAM FOR ADC 8 BIT 
  connection details:-	
											J2(PORT1) - J14(DC & Stepper motor)
											J3(PORT2) - J15(DC & Stepper motor)
											
*/
#include <reg51.h>

sbit start=P2^0;
sbit inc  =P2^2;
sbit dec  =P2^3;
sbit rev  =P2^1;
sbit stop =P2^4;

sbit IN1  =P1^4;
sbit IN2  =P1^5;
sbit IN3  =P1^6;
sbit IN4  =P1^7;
sbit EN1  =P1^0;
sbit EN2  =P1^1;

unsigned int count=25,run=0,DIR;

void delay(unsigned int t);
void rotation(void);

int main()
{
	P1=0x00;
	P2=0xFF;
	EN1=0;
	EN2=0;
	while(1)
		{			
				if(start==0)	
					{
						DIR=0;
						EN1=1;
						EN2=1;
						count = 25;
						run=1;		
					}					
				else if(rev==0)		
					{	
						DIR=1;	
					}				
				else if(inc==0 & count>2)
				{
					count  = count-1;
					delay(20);
				}
				else if(dec==0 & count<50)
				{
					count  = count+1;	
					delay(20);
				}				
				else if(stop==0)
				{
						EN1=0;
						EN2=0;
						IN1=0;IN2=0;IN3=0;IN4=0;
						run=0;
				}	
				if(run==1)
					 rotation();	
		}
}

void rotation(void)
{
	if(DIR==0)
		{
			IN1=0;IN2=0;IN3=1;IN4=1;
			delay(count);
			IN1=0;IN2=1;IN3=1;IN4=0;
			delay(count);
			IN1=1;IN2=1;IN3=0;IN4=0;
			delay(count);
			IN1=1;IN2=0;IN3=0;IN4=1;
			delay(count);
		}
		
	if(DIR==1)	
	{
			IN1=1;IN2=0;IN3=0;IN4=1;
			delay(count);
			IN1=1;IN2=1;IN3=0;IN4=0;
			delay(count);
			IN1=0;IN2=1;IN3=1;IN4=0;
			delay(count);
			IN1=0;IN2=0;IN3=1;IN4=1;
			delay(count);
	}
}

 void delay(unsigned int t)
{
	unsigned int i,j;
	for(i=0;i<t;i++)
	for(j=0;j<95;j++);
}

