/* 
  Company Name:- Logsun Systems
  connection details:-	
											J5(PORT1) - J1(8 BIT DAC)
*/

#include <reg51.h>

unsigned int i=0;
void delay(unsigned int itime);

void main(void)
{
	  unsigned char i,j;
		P1 = 0x00;      //P1 AS OUTPUT PORT	
		
		while(1)
		{
			for(i=0x00;i<=0xF0;i++)
			{
				P1=i;	
	//				delay(1);
			}
			for(j=0xF0;j>=0x01;j--)
			{
				P1=i;
	//			delay(1);
			}
		}
}

void delay(unsigned int itime)
{
int i,j;
for(i=0;i<=itime;i++)
for(j=0;j<=5;j++);

}

