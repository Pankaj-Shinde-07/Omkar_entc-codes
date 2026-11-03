/* 
  Company Name:- Logsun Systems
  connection details:-	
											J1(PORT0) - J12(DATA)
											J5(PORT1) - J12(transistor)
*/

#include <reg51.h>

void display(unsigned char byte);
void delay(unsigned int time);

void main(void)
  {
			 P0 = 0x00;	
			 P1 = 0xff;	
			 while(1)
				{
					display(0xC0);	// Display 0
					display(0xF9);	// Display 1
					display(0xA4);	// Display 2
					display(0xB0);	// Display 3
					display(0x99);	// Display 4
					display(0x92);	// Display 5
					display(0x82);	// Display 6
					display(0xF8);	// Display 7
					display(0x80);	// Display 8
				 	display(0x90);	// Display 9
					display(0x88);	// Display A
					display(0x83);	// Display B
					display(0xC6);	// Display C
					display(0xA1);	// Display D
					display(0x86);	// Display E
					display(0x8E);	// Display F

				}		
	}
void display(unsigned char byte)
	{
		P0 = byte;
		delay(200);
	}
 void delay(unsigned int time)
	{
		int i,j;
		for(i=0;i<time;i++)
		for(j=0;j<1000;j++);
	}