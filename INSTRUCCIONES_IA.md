

\---



\## 2. `INSTRUCCIONES\_IA.md`



```markdown

\# Instrucciones para Asistentes de IA (copilotos, agentes, etc.)



Este archivo resume las reglas de negocio, estructura de datos y puntos de integración del sistema \*\*Ecosistema Laboratorio de Saberes Populares v2.0.1\*\* para que puedas asistir en su desarrollo, depuración o extensión.



\## 📌 Dominio del problema



\- \*\*UNACOM\*\*: Universidad Nacional Comunal (Venezuela).

\- \*\*Propósito\*\*: Sistematizar experiencias de saberes populares, prácticas comunitarias, historias de lucha, feminismo comunal, innovación popular.

\- \*\*Usuarios\*\*: Registradores (facilitadores territoriales) que llenan el formulario y reciben un informe PDF.



\## 🧠 Reglas de negocio fundamentales



\### Líneas de sistematización



\- El formulario permite elegir múltiples líneas.

\- Si se marca `contacto\_inicial`, se deshabilitan las demás y se ocultan los formularios específicos.

\- Líneas actuales: `historia\_lucha`, `haceres\_saberes`, `feminismo\_comunal`, `innovacion\_popular`.

\- Cada línea tiene sus propios campos en la fase 2 (`descripcion\_general\_practica`, `innovacion`, `retos`, `otra\_info`, `relato`).



\### Protagonistas



\- Se debe registrar al menos un portador del saber.

\- Cada protagonista tiene: nombre, cédula, teléfono, habilidad/saber específico, nivel de estudio (formal), y opcionalmente un archivo de biografía (PDF/Word).



\### Datos territoriales



\- Estado, municipio y parroquia se cargan desde una hoja de cálculo llamada \*\*"Territorio"\*\* (columnas: Estado, Municipio, Parroquia).

\- Los selectores se habilitan en cascada.



\### Código de registro



Formato: `UNACOM-<3 primeras letras del estado en mayúscula>-<año>-<4 dígitos aleatorios>`  

Ejemplo: `UNACOM-MIR-2026-3851`



\### Archivos adjuntos



\- \*\*Documentos\*\* (PDF/Word): se guardan solo en Drive (no en Cloud Storage).

\- \*\*Imágenes\*\* (evidencias fotográficas): se suben a \*\*Cloud Storage\*\* (si está activado) y también a Drive como respaldo.

\- \*\*Informe de abordaje\*\*: PDF/Word opcional que se guarda en Drive.



\### Flujo de procesamiento en el backend



1\. Validar payload (estructura básica).

2\. Generar código de registro y fecha.

3\. Crear carpeta en Drive: `carpeta\_maestra / estado / \[código] - nombre\_experiencia`.

4\. Guardar evidencias y documentos dentro de esa carpeta.

5\. Copiar plantilla de Google Doc, reemplazar marcadores `{{...}}` con los datos, guardar como PDF.

6\. Enviar PDF por correo al registrador.

7\. Agregar fila a la hoja de cálculo principal.

8\. (Opcional) Escribir en Firestore.



\## 📦 Estructura del payload (desde el frontend)



El método `procesar\_formulario\_v2(payload)` recibe un objeto con esta forma:



```typescript

interface Payload {

&#x20; metadatos\_registro: {

&#x20;   registrador: string;

&#x20;   telefono: string;

&#x20;   correo: string;

&#x20;   pertenece\_unacom: "Sí" | "No";

&#x20;   vicerrectorado?: string;      // si pertenece\_unacom === "Sí"

&#x20;   ente\_externo?: string;        // si pertenece\_unacom === "No"

&#x20; };

&#x20; identificacion\_experiencia: {

&#x20;   nombre\_experiencia: string;

&#x20;   fecha\_abordaje: string;       // YYYY-MM-DD

&#x20;   fecha\_iniciacion\_experiencia?: string; // año

&#x20;   estado: string;

&#x20;   municipio: string;

&#x20;   parroquia: string;

&#x20;   comuna\_circuito\_comunal: string;

&#x20;   tipo\_organizacion: string;

&#x20; };

&#x20; saber\_comunero: {

&#x20;   descripcion\_general\_saber\_hacer: string;

&#x20;   lineas\_sistematizacion: string\[]; // ej: \["historia\_lucha", "feminismo\_comunal"]

&#x20;   historia\_lucha?: LineaData;

&#x20;   haceres\_saberes?: LineaData;

&#x20;   feminismo\_comunal?: LineaData;

&#x20;   innovacion\_popular?: LineaData;

&#x20; };

&#x20; protagonistas: Protagonista\[];

&#x20; cierre\_y\_proyeccion: {

&#x20;   area\_unacom?: string;

&#x20;   pnf\_vinculado?: string\[];      // array de valores de los PNF

&#x20;   ruta\_trabajo\_sugerida?: string\[];

&#x20;   elementos\_memoria\_historica?: MemoriaElement\[];

&#x20;   informe\_abordaje\_b64?: string; // base64 del PDF/Word

&#x20;   evidencias\_b64?: Array<{b64: string, mime: string, nom: string}>;

&#x20; };

}



interface LineaData {

&#x20; descripcion\_general\_practica: string;

&#x20; innovacion\_en\_esta\_linea: string;

&#x20; retos\_solucionados\_en\_esta\_linea: string;

&#x20; otra\_informacion: string;

&#x20; relato\_especifico: string;

}



interface Protagonista {

&#x20; nombre\_portador: string;

&#x20; cedula: string;

&#x20; telefono: string;

&#x20; habilidad\_saber: string;

&#x20; nivel\_estudio: string; // "Ninguno"|"Primaria"|"Secundaria"|"Técnico"|"Universitario"

&#x20; url\_biografia\_b64?: string; // base64 de PDF/Word

}



interface MemoriaElement {

&#x20; tipo\_elemento: "Enlace Web o Red Social" | "Documento Físico/Referencia";

&#x20; descripcion\_elemento: string;

&#x20; enlace\_o\_archivo: string;

}

