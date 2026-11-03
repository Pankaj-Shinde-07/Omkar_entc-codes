
/*

  Title: Relay & Buzzer

  Connection:
  J3(Port-2) => J7

  Press Relay switch to turn On the relay and turn off the buzzer
  Press Buzzer Switch to turn on the buzzer and turn off the realy


*/



#include<reg51.h>



sbit Relay = P2^0;
sbit Buzzer = P2^1;
sbit Relay_SW = P2^2;
sbit Buzz_SW = P2^3;




void main()
{
   P2 = 0xFC;

   Relay =0;
   Buzzer= 0;

   while(1){

   if(Relay_SW == 0)
   {
	 Relay =0;
	 Buzzer =1;
   }
   

   if(Buzz_SW == 0)
   {
		Buzzer =0;
		Relay = 1;
   }
   
   }

}