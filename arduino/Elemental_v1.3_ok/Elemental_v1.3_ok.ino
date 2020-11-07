#include <Keyboard.h>
#include <EEPROM.h>

/*  Multiplexor señal
 *  -----------------
 *  Este pin Z del multiplexor emite un valor entre 500 - 900 cuando una tecla es pulsada
 *  este valor puede variar en función de la resistencia que pongamos entre Z y GND (masa)
 *  se recomienda una resistencia de 100 y detectar la tecla pulsada con if (val > 300) {}
 */
int pinZMulti = A7;
/*  Funcion leer valor
 *  ------------------
 */
int leerValor() {
  return analogRead(pinZMulti);
}

/*  Multiplexor config pin read
 *  ---------------------------
 *  Estos pines se usan para seleccionar en el multiplexor la columna
 *  que queremos comprobar si una tecla está pulsada
 */
int pinesMulti[4] = {10, 16, 4, 5};

/*  Funcion seleccion de columna
 *  ----------------------------
 */
void activarColumna(int n) {
  // Activa la columna
  for (int j = 0; j < 4; j ++) {
      digitalWrite(pinesMulti[j], bitRead(n, j));
  }
}




/*  Pines filas
 *  -----------
 *  Pines para activar la corriente en las distintas filas, empezando desde arriba
 *  Fila 0: 18
 *  Fila 1: 20 y 3
 *  Fila 2: 21 y 9
 *  Fila 3: 14, 15 y 8
 *  Fila 4: 2
 */
int pinesFilas[9] = {18, 20, 3, 21, 9, 14, 15, 8, 2};

/*  Funciones cambio de filas
 *  -------------------------
 *  Valor n: número de fila (0, 1, 2, 3, 4)
 *  Valor v: encender o apagar (HIGH, LOW)
 */
void cambiarFila(int n, int v) {
  switch (n) {
    case 0: digitalWrite(18, v);
      break;
    case 1: digitalWrite(20, v);
      digitalWrite(3, v);
      break;
    case 2: digitalWrite(21, v);
      digitalWrite(9, v);
      break;
    case 3: digitalWrite(14, v);
      digitalWrite(15, v);
      digitalWrite(8, v);
      break;
    case 4: digitalWrite(2, v);
      break;
  }
  delayMicroseconds(25);
} 


/*  Array para controlar las teclas pulsadas
 *  ----------------------------------------
 */
bool matrizTeclasPulsadas[5][15] = {
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0},
  {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}
};


/*  Array con la configuración de teclas
 *  ------------------------------------
 */
int teclas[5][15] = {
    // ESC 1 2 3 4 5 6 7 8 9 0 ' ¡ _ F12
    {27, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 181, 182, 0, 205},
    // TAB q w e r t y u i o p ` + BACKSPACE SUPR
    {179, 156, 162, 144, 157, 159, 164, 160, 148, 154, 155, 183, 184, 178, 212},
    // BMAYUS=129 a s d f g h j k l ñ ´ ç ENTER HOME
    {-4, 140, 158, 143, 145, 146, 147, 149, 150, 151, 187, 188, 186, 176, 210},
    // SHIFT < z x c v b n m , . - SHIFT UP END
    {133, 189, 165, 163, 142, 161, 141, 153, 152, 190, 191, 192, 133, 218, 213},
    // CTRL ALT CMD - - - SPACE - - ALTGR FN1 FN2 LEFT DOWN RIGHT
    {128, 130, 131, 0, 0, 0, 180, 0, 0, 134, 0, 0, 216, 217, 215}
};


// Variables temporales
int fila = 0;
int columna = 0;
int val = 0;
int code = 0;
int addr = 0;

// Bloqueo de mayusculas
bool bloqueo = false;


void setup() {
  
  // Multiplex selección columna
  for (int i = 0; i < 4; i++) {
    pinMode(pinesMulti[i], OUTPUT);
  }
  
  // Valor lectura
  pinMode(pinZMulti, INPUT);

  // Pines filas
  for (int i = 0; i < 9; i++) {
    pinMode(pinesFilas[i], OUTPUT);
  }

  loadKeycodes();
  Serial.begin(9600);

}

String getValue(String data, char separator, int index)
{
    int found = 0;
    int strIndex[] = { 0, -1 };
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++) {
        if (data.charAt(i) == separator || i == maxIndex) {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i+1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

void loadKeycodes() {
  for (columna = 0; columna < 15; columna ++) {
    for (fila = 0; fila < 5; fila ++) {
      addr = columna + fila * 15;
      code = EEPROM.read(addr);
      if (code) {
        teclas[fila][columna] = code;
      }
    }
  }
}

void changeKeycode(int addr, int code) {
  columna = addr % 15;
  fila = (addr - columna) / 15;
  teclas[fila][columna] = code;
}

void loop() {

  if (Serial.available()) {
    String msg = Serial.readString();
    if (msg == "who are you?") {
      Serial.println("model:elementalv1");
    } else if (msg == "get") {
      for (int i = 0; i < 15 * 5; i ++) {
        code = EEPROM.read(i);
        Serial.println("keycode:" + (String) i + ":" + (String) code);
      }
      Serial.print("get:ok");
    } else if (getValue(msg, ':', 0) == "put") {
      addr = getValue(msg, ':', 1).toInt();
      code = getValue(msg, ':', 2).toInt();
      EEPROM.update(addr, code);
      changeKeycode(addr, code);
      Serial.print("put:ok");
    }
  }
 
  // Recorre las columnas
  for (columna = 0; columna < 15; columna ++) {
    
    // Activar la columna
    activarColumna(columna);

    // Recorre las filas
    for (fila = 0; fila < 5; fila ++) {

      // Activa la fila
      cambiarFila(fila, HIGH);

      // Lee valor
      val = leerValor();
      
      // Si la tecla esta pulsada
      if (val > 2) {

        // Si la tecla NO esta marcada como pulsada
        if (matrizTeclasPulsadas[fila][columna] == false) {

            // Codigo de la tecla
            code = teclas[fila][columna];
            if (code > 0) {

              // Si tiene bloqueo de mayusculas
              if (bloqueo) {
                if (code >= 140 && code <= 165) {
                  code = code - 75;
                } else if (code == 187) {
                  code = 58;
                }
              }
              
              // Pulsamos la tecla
              Keyboard.press(code);
            }
  
            // La marcamos como pulsada
            matrizTeclasPulsadas[fila][columna] = true;
        }
        
      // Si la tecla NO está pulsada
      } else {
        
        // Si la tecla está marcada como pulsada
        if (matrizTeclasPulsadas[fila][columna] == true) {

          // Codigo de la tecla
          code = teclas[fila][columna];
          if (code > 0) {

            // Si tiene bloqueo de mayusculas
            if (bloqueo) {
              if (code >= 140 && code <= 165) {
                code = code - 75;
              } else if (code == 187) {
                code = 58;
              }
            }
              
            // Soltamos la tecla
            Keyboard.release(code);
          }
          
          // La desmarcamos como pulsada
          matrizTeclasPulsadas[fila][columna] = false;

          // Bloquer de mayusculas
          if (teclas[fila][columna] == -4) {
            bloqueo = !bloqueo;
          }
        }
      }
      
      cambiarFila(fila, LOW);
    }
  }
}
