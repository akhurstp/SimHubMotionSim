#include <ArduinoJson.h>

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial2.begin(115200, SERIAL_8N1, 16, 17);

  StaticJsonDocument<200> doc;
  char buf[500];
  while(1) {
    if(Serial2.available() > 0) {
      deserializeJson(doc, Serial2);
      float roll = doc["ROLL"];
      float pitch = doc["PITCH"];
      float yaw = doc["YAW"];

      Serial.print("Roll: ");
      Serial.print(roll);
      Serial.print("\tPitch: ");
      Serial.print(pitch);
      Serial.print("\tYaw: ");
      Serial.print(yaw);
      Serial.println();      
    }
  }
}

void loop() {}
