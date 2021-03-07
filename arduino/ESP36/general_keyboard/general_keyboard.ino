//#include <BleKeyboard.h>

//BleKeyboard bleKeyboard("Miguelio Rock");

#include <WiFi.h>

// Server Web
WiFiServer server(80);
int contconexion = 0;
String header;
String estadoSalida = "off";
const int salida = 2;
String pagina = "<!DOCTYPE html>"
"<html>"
"<head>"
"<meta charset='utf-8' />"
"<title>Miguelio</title>"
"</head>"
"<body>"
"<center>"
"<h1>Miguelio Rock</h1>"
"<p><a href='https://www.miguelio.com'><button style='height:50px;width:100px'>Configure Keyboard Keys</button></a></p>"
"</center>"
"</body>"
"</html>";

// WiFi conection
char ssid[256] = "";
char password[256] = "";
int wifiStatus = 0;
const int wifiListLimit = 50;
String wifiList[wifiListLimit] = {};


// Input command
String command;



#include "Keyboard.h"



void setup() {
  Serial.begin(115200);
  //bleKeyboard.begin();
  Serial.println(" ");
  Serial.println("Iniciado!");
}

void loop() {


  Keyboard.press(41);
  Keyboard.releaseAll();

  delay(5000);

  
  /*
  if(bleKeyboard.isConnected()) {
    Serial.println("Sending 'Hello world'...");
    bleKeyboard.print("Hello world");

    delay(1000);

    Serial.println("Sending Enter key...");
    bleKeyboard.write(KEY_RETURN);

    delay(1000);

    Serial.println("Sending Play/Pause media key...");
    bleKeyboard.write(KEY_MEDIA_PLAY_PAUSE);

    delay(1000);

    Serial.println("Sending Ctrl+Alt+Delete...");
    bleKeyboard.press(KEY_LEFT_CTRL);
    bleKeyboard.press(KEY_LEFT_ALT);
    bleKeyboard.press(KEY_DELETE);
    delay(100);
    bleKeyboard.releaseAll();

  } else {
    Serial.println("Waiting 5 seconds...");
    delay(5000);
  }
  */
  if (Serial.available()) {
      while (Serial.available()) {
        delay(3);  
        char c = Serial.read();
        command += c; 
      }
      command.trim();
      if (command.length() > 0) {
        
         if (command == "wifi start") { //////////////////////////////////////////// WIFI 0
          
          Serial.println("Iniciando WIFI...");
          wifiStatus = 1;
          int numberOfNetworks = WiFi.scanNetworks();
          Serial.print("Number of networks found: ");
          Serial.println(numberOfNetworks);
          int count = 0;
          while (count < numberOfNetworks && count < wifiListLimit) {
            wifiList[count] = (String) WiFi.SSID(count);
            Serial.print((String) count + " ");
            Serial.println(WiFi.SSID(count));
            count ++;
          }
          
          Serial.println(" ");
          Serial.println("Type the number of network: ");
          
        } else if (command == "wifi ip") {
            Serial.println(WiFi.localIP());  
        }else if (wifiStatus == 1) { ////////////////////////////////////////////// WIFI 1
          
           String wifiSSID = wifiList[command.toInt()];
           Serial.println("Type password to network "+wifiSSID+": ");
           
           wifiSSID.toCharArray(ssid, wifiSSID.length()+1);
           
           wifiStatus = 2;
          
        } else if (wifiStatus == 2) { ////////////////////////////////////////////// WIFI 2

           command.toCharArray(password, command.length()+1);
           Serial.println("Network: "+(String) ssid);
           Serial.println("Password: "+(String) password);
           Serial.println("Establishing connection to WiFi...");
           
           WiFi.begin(ssid, password);
           int count2 = 0;
           while (WiFi.status() != WL_CONNECTED && count2 < 10) {
              delay(3000);
              Serial.println("Establishing connection to WiFi...");
              count2 ++;
           }

           if (WiFi.status() != WL_CONNECTED) {
              Serial.println("Could not connect to the WiFi network");
              wifiStatus == 0;
           } else {
              Serial.println("Connected to network");
              delay(50);
              Serial.print("local IP: ");
              Serial.println(WiFi.localIP());
              wifiStatus = 3;
              server.begin();
           }
           
          
        } else {
          
          Serial.println("Comando desconocido: " + (String) command);
        }
        command = "";
      }
  } else {
      
      if (wifiStatus == 3) {
          WiFiClient client = server.available();   // Escucha a los clientes entrantes

          if (client) {                             // Si se conecta un nuevo cliente
            Serial.println("New Client.");          // 
            String currentLine = "";                //
            while (client.connected()) {            // loop mientras el cliente está conectado
              if (client.available()) {             // si hay bytes para leer desde el cliente
                char c = client.read();             // lee un byte
                Serial.write(c);                    // imprime ese byte en el monitor serial
                header += c;
                if (c == '\n') {                    // si el byte es un caracter de salto de linea
                  // si la nueva linea está en blanco significa que es el fin del 
                  // HTTP request del cliente, entonces respondemos:
                  if (currentLine.length() == 0) {
                    client.println("HTTP/1.1 200 OK");
                    client.println("Content-type:text/html");
                    client.println("Connection: close");
                    client.println();
                    
                    // enciende y apaga el GPIO
                    /*
                    if (header.indexOf("GET /on") >= 0) {
                      Serial.println("GPIO on");
                      estadoSalida = "on";
                      digitalWrite(salida, HIGH);
                    } else if (header.indexOf("GET /off") >= 0) {
                      Serial.println("GPIO off");
                      estadoSalida = "off";
                      digitalWrite(salida, LOW);
                    }
                    */
                    
                    // Muestra la página web
                    client.println(pagina);
                    
                    // la respuesta HTTP temina con una linea en blanco
                    client.println();
                    break;
                  } else { // si tenemos una nueva linea limpiamos currentLine
                    currentLine = "";
                  }
                } else if (c != '\r') {  // si C es distinto al caracter de retorno de carro
                  currentLine += c;      // lo agrega al final de currentLine
                }
              }
            }
            // Limpiamos la variable header
            header = "";
            // Cerramos la conexión
            client.stop();
            Serial.println("Client disconnected.");
            Serial.println("");
          }
      }
  }
  
}

char* readSerial() {
  char inData[20] = "";
  if (Serial.available() > 0) {
    int h = Serial.available();
    for (int i = 0; i < h; i++) {
      inData[i]=(char)Serial.read();
      inData[i+1]='\0';
    }
  }
  return inData;
}
