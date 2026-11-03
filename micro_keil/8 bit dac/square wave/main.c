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
			P1 = 0x00;      //P1 AS OUTPUT PORT	
		{
		while(1)
			{
				P1 = 0xFF;	
				delay(5);
				P1 = 0x00;
				delay(5);	
			}
		}
}

void delay(unsigned int itime)
{
int i,j;
for(i=0;i<=itime;i++)
for(j=0;j<=100;j++);

}

