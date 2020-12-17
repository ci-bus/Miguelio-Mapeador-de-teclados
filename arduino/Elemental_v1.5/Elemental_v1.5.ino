#include "Keyboard.h"
#include "EEPROM.h"
#include "MIDIUSB.h"

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
int leerValor()
{
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
void activarColumna(int n)
{
    // Activa la columna
    for (int j = 0; j < 4; j++)
    {
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
void cambiarFila(int n, int v)
{
    switch (n)
    {
    case 0:
        digitalWrite(18, v);
        break;
    case 1:
        digitalWrite(20, v);
        digitalWrite(3, v);
        break;
    case 2:
        digitalWrite(21, v);
        digitalWrite(9, v);
        break;
    case 3:
        digitalWrite(14, v);
        digitalWrite(15, v);
        digitalWrite(8, v);
        break;
    case 4:
        digitalWrite(2, v);
        break;
    }
}

/*  Array con la configuración de teclas
 *  ------------------------------------
 */
int teclas[150] = {
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

/*  Array para controlar las teclas pulsadas
 *  ----------------------------------------
 */
bool matrizTeclasPulsadas[150] = {
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,

    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

// Variables temporales
int mapeo = 0;
int columna = 0;
int fila = 0;
int val = 0;
int code = 0;
int addr = 0;

// Teclas MIDI
bool midi = false;

void setup()
{

    // Multiplex selección columna
    for (int i = 0; i < 4; i++)
    {
        pinMode(pinesMulti[i], OUTPUT);
    }

    // Valor lectura
    pinMode(pinZMulti, INPUT);

    // Pines filas
    for (int i = 0; i < 9; i++)
    {
        pinMode(pinesFilas[i], OUTPUT);
    }

    // Lee valores EEPROM
    loadKeycodes();

    // Setea mapeo
    mapeo = 0;

    // Inicializa puerto serial para comunicaciones con el software
    Serial.begin(9600);
}

// Funcion para coger partes de un string
String getValue(String data, char separator, int index)
{
    int found = 0;
    int strIndex[] = {0, -1};
    int maxIndex = data.length() - 1;

    for (int i = 0; i <= maxIndex && found <= index; i++)
    {
        if (data.charAt(i) == separator || i == maxIndex)
        {
            found++;
            strIndex[0] = strIndex[1] + 1;
            strIndex[1] = (i == maxIndex) ? i + 1 : i;
        }
    }
    return found > index ? data.substring(strIndex[0], strIndex[1]) : "";
}

// Funcion para leer numeros de 2 bytes
int EEPROMReadInt(int addr)
{
    addr = addr * 2;
    int byte1 = EEPROM.read(addr);
    int byte2 = EEPROM.read(addr + 1);

    return ((byte1 << 0) & 0xFF) + ((byte2 << 8) & 0xFFFF);
}

// Funcion para guardar numeros de 2 bytes
void EEPROMWriteInt(int addr, int val)
{
    addr = addr * 2;
    byte byte1 = (val & 0xFF);
    byte byte2 = ((val >> 8) & 0xFF);

    EEPROM.update(addr, byte1);
    EEPROM.update(addr + 1, byte2);
}

// Lee la configuracion de teclas guardadas en memoria EEPROM
void loadKeycodes()
{
    for (addr = 0; addr < 150; addr++)
    {
        teclas[addr] = EEPROMReadInt(addr);
    }
}

// Cambiar configuracion tecla
void changeKeycode(int addr, int code)
{
    EEPROMWriteInt(addr, code);
    teclas[addr] = code;
}

// Cambio de mapeo para tecla fn
void changeMap(int val)
{

    // Seguridad para que no queden teclas pulsadas al cambiar de mapeo
    for (int a = mapeo * 75; a < mapeo * 75 + 75; a++)
    {
        // La desmarcamos como pulsada
        matrizTeclasPulsadas[a] = false;
    }

    // Soltamos todas las teclas
    Keyboard.releaseAll();

    // Cambio de mapeo
    mapeo = val;
}

void loop()
{

    // Comunicacion con el software
    if (Serial.available())
    {
        String msg = Serial.readString();

        // Mensaje modelo del teclado
        if (msg == "who are you?")
        {
            Serial.println("model:elementalv1");

            // Coger configuraciones de teclas
        }
        else if (msg == "get")
        {
            for (addr = 0; addr < 150; addr++)
            {
                code = teclas[addr];
                Serial.println("keycode:" + (String)addr + ":" + (String)code);
            }
            Serial.print("get:ok");

            // Configurar teclas
        }
        else if (getValue(msg, ':', 0) == "put")
        {
            addr = getValue(msg, ':', 1).toInt();
            code = getValue(msg, ':', 2).toInt();
            changeKeycode(addr, code);
            Serial.print("put:ok");
        }
    }

    // Recorre las columnas
    for (columna = 0; columna < 15; columna++)
    {

        // Activar la columna
        activarColumna(columna);

        // Recorre las filas
        for (fila = 0; fila < 5; fila++)
        {

            // Activa la fila
            cambiarFila(fila, HIGH);

            // Lee valor
            val = leerValor();

            // Calcula la direccion de la tecla
            addr = mapeo * 75 + fila * 15 + columna;

            // Codigo de la tecla
            code = teclas[addr];

            // Si la tecla esta pulsada, este valor minimo dependera de la resistencia
            if (val > 15)
            {

                // Si la tecla NO esta marcada como pulsada
                if (matrizTeclasPulsadas[addr] == false)
                {

                    switch (code)
                    {

                    case 22: // Tecla FN
                        // Cambia el mapeo del teclado
                        changeMap(1);
                        addr += 75;
                        break;

                    case 23: // Tecla MIDI, no hace nada, esto se activa al soltar la tecla
                        break;

                    default: // Resto de teclas

                        // Si MIDI esta activo
                        if (midi)
                        {
                            // Pulsamos nota MIDI
                            noteOn(0, addr, 127);
                            MidiUSB.flush();
                        }
                        // Teclas multimedia
                        else if (code >= 300)
                        {
                            Keyboard.press_direct(code - 300);
                            Keyboard.releaseAll();
                        }
                        else // Si es una tecla común
                        {
                            // Pulsamos la tecla
                            Keyboard.press(code);
                            break;
                        }
                    }

                    // La marcamos como pulsada
                    matrizTeclasPulsadas[addr] = true;
                }

                // Si la tecla NO está pulsada
            }
            else if (val < 5)
            {

                // Si la tecla está marcada como pulsada
                if (matrizTeclasPulsadas[addr] == true)
                {

                    switch (code)
                    {

                    case 22: // Tecla FN
                        // Cambia el mapeo del teclado
                        changeMap(0);
                        addr -= 75;
                        break;

                    case 23: // Tecla MIDI
                        midi = !midi;
                        break;

                    default: // Resto de teclas

                        // Si MIDI esta activo
                        if (midi)
                        {
                            // Soltamos nota MIDI
                            noteOff(0, addr, 0);
                            MidiUSB.flush();
                        }
                        // Teclas multimedia
                        else if (code >= 300)
                        {
                            Keyboard.release_direct(code - 300);
                        }
                        else
                        {
                            // Soltamos la tecla
                            Keyboard.release(code);
                        }
                        break;
                    }

                    // La desmarcamos como pulsada
                    matrizTeclasPulsadas[addr] = false;
                }
            }

            cambiarFila(fila, LOW);
        }
    }
}

// First parameter is the event type (0x09 = note on, 0x08 = note off).
// Second parameter is note-on/note-off, combined with the channel.
// Channel can be anything between 0-15. Typically reported to the user as 1-16.
// Third parameter is the note number (48 = middle C).
// Fourth parameter is the velocity (64 = normal, 127 = fastest).

void noteOn(byte channel, byte pitch, byte velocity)
{
    midiEventPacket_t noteOn = {0x09, 0x90 | channel, pitch, velocity};
    MidiUSB.sendMIDI(noteOn);
}

void noteOff(byte channel, byte pitch, byte velocity)
{
    midiEventPacket_t noteOff = {0x08, 0x80 | channel, pitch, velocity};
    MidiUSB.sendMIDI(noteOff);
}
