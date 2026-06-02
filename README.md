\# 🌱 Ecosistema Laboratorio de Saberes Populares - UNACOM v2.0.1



Sistema de registro y sistematización de experiencias comunales y saberes populares para la Universidad Nacional Comunal (UNACOM).  

Permite capturar datos geográficos, narrativas, protagonistas, evidencias fotográficas y generar un informe oficial en PDF.



\## 🚀 Funcionalidades principales



\- Formulario multipaso (Mapeo → Saber → Perfiles → Cierre) con validaciones.

\- Carga dinámica de estados, municipios y parroquias desde Google Sheets.

\- Registro de múltiples portadores del saber (protagonistas).

\- Adjuntar documentos (PDFWord) y múltiples imágenes.

\- Subida de imágenes a Google Cloud Storage (opcional) y backup en Drive.

\- Generación automática de código único de registro.

\- Creación de carpetas organizadas en Drive `\[código] - nombre\_experiencia`.

\- Rellenado de plantilla de Google Doc y conversión a PDF.

\- Envío del PDF por correo electrónico al registrador.

\- Registro estructurado en Google Sheets.

\- (Opcional) Almacenamiento en Firestore.



\## 🧰 Requisitos previos (configuración única)



1\. Google Apps Script habilitado.

2\. IDs de los siguientes recursos (crearcopiar y pegar en `código.gs`)

&#x20;  - Carpeta raíz en Drive (`id\_carpeta\_maestra`).

&#x20;  - Plantilla de Google Doc con marcadores `{{...}}` (`id\_plantilla\_doc`).

&#x20;  - Hoja de cálculo con dos pestañas una para datos maestros (Territorio) y otra para recibir los registros (`id\_hoja\_calculo`).

3\. Hoja Territorio con columnas `Estado`, `Municipio`, `Parroquia`.

4\. Cloud Storage (opcional)

&#x20;  - Crear bucket en Google Cloud con nombre `unacom-ecosistema-fotos`.

&#x20;  - Habilitar API de Cloud Storage en el proyecto.

&#x20;  - Obtener token OAuth2 (Apps Script lo gestiona automáticamente si se agregan los alcances).

5\. Firestore (opcional)

&#x20;  - Tener una base de datos Firestore con colección `experiencias\_unacom`.

&#x20;  - Configurar correctamente `projectId` y `database` en `código.gs`.



\## 🔧 Instalación y despliegue



1\. Ve a \[script.google.com](httpsscript.google.com) y crea un nuevo proyecto.

2\. Copia cada archivo de este repositorio en el editor de Apps Script

&#x20;  - `Index.html` → como archivo HTML.

&#x20;  - `código.gs`, `pruebas.gs`, `cloudstorage.gs` → como archivos .gs.

3\. Actualiza las siguientes constantes en `código.gs` con tus IDs

&#x20;  ```javascript

&#x20;  const id\_carpeta\_maestra = TU\_ID\_CARPETA;

&#x20;  const id\_plantilla\_doc    = TU\_ID\_PLANTILLA;

&#x20;  const id\_hoja\_calculo     = TU\_ID\_SHEETS;

