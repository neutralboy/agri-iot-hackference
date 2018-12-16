#include <Arduino.h>
#include <WiFi.h>
#include <WiFiClient.h>
#include <Adafruit_BMP085.h>
#include <DHT.h>
#include <ArduinoJson.h>
#include <HTTPClient.h>

// Uncomment one of the lines below for whatever DHT sensor type you're using!
#define DHTTYPE DHT11   // DHT 11

/*Put your SSID & Password*/
const char* ssid = "KstartGuest";  // Enter SSID here
const char* password = "ImagineTomorrow";  //Enter Password here

int soil_sensor_pin =16;

Adafruit_BMP085 bmp;
HTTPClient http;

// DHT Sensor
int DHTPin = 4; 
               
// Initialize DHT sensor.
DHT dht(DHTPin, DHTTYPE);                

float Temperature;
float Humidity;
 
void setup() {
  Serial.begin(115200);
  delay(100);
  
  pinMode(DHTPin, INPUT);
  pinMode(soil_sensor_pin, INPUT);
  dht.begin();  

  bmp.begin();

  Serial.println("Connecting to ");
  Serial.println(ssid);

  //connect to your local wi-fi network
  WiFi.begin(ssid, password);

  //check wi-fi is connected to wi-fi network
  while (WiFi.status() != WL_CONNECTED) {
  delay(1000);
  Serial.print(".");
  }
  Serial.println("");
  Serial.println("WiFi connected..!");

}
void loop() {
  
  handle_OnConnect();
  
}

float Soil_Temperature=0.0;
float Air_Temperature=0.0;
float humidity=0.0;
float soil_moisture_value=0.0;
float pressure=0.0;

void handle_OnConnect() {

  Soil_Temperature = bmp.readTemperature();
  pressure = bmp.readPressure();
  Air_Temperature = dht.readTemperature(); // Gets the values of the temperature
  humidity = dht.readHumidity(); // Gets the values of the humidity 
  soil_moisture_value = analogRead(35);//Gets value of the Soil Moisture as Analog input
  Serial.println(soil_moisture_value);
  soil_moisture_value = map(soil_moisture_value,1023,0,0,100);//Converts to Analog 
  json_Send(Air_Temperature,humidity,Soil_Temperature,soil_moisture_value,pressure); 
}

int json_Send(float Air_Temperature,float Humidity,float Soil_Temperature,float Soil_Moisture,float Pressure)
{
  String hash="gAAAAABcFQknsMtB4-Va977B86e_ArHeU7_Hedr7bERXzDCGNgc0i9z9furhXy5qaH8va-rVS_wua4OCW5yEU7jDI-hT5lCZ7w==";
  DynamicJsonBuffer JSONbuffer;
  JsonObject& JSONencoder = JSONbuffer.createObject();

  Serial.println(Air_Temperature);
  Serial.println(Humidity);
  Serial.println(Soil_Temperature);
  Serial.println(Soil_Moisture);
  Serial.println(Pressure);
  
  JSONencoder["Air_Temp"] = Air_Temperature;
  JSONencoder["Humidity"] = Humidity;
  JSONencoder["Soil_Temp"] = Soil_Temperature;
  JSONencoder["Soil_Moisture"] = Soil_Moisture;
  JSONencoder["Pressure"]=Pressure;
  JSONencoder["hash"]=hash;

  char JSONmessageBuffer[200];

  JSONencoder.printTo(JSONmessageBuffer);
  http.begin("https://test.pcms.me/API/data/");              //Specify destination for HTTP request
  http.addHeader("Content-Type", "application/json");             //Specify content-type header
  delay(30000);
  int httpResponseCode = http.POST(JSONmessageBuffer);            //Send the actual POST request
  if(httpResponseCode>0){
    String response = http.getString();  //Get the response to the request
    Serial.println(httpResponseCode);   //Print return code
    Serial.println(response);           //Print request answer
   }
   else
   {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
   }
   http.end();
  
}