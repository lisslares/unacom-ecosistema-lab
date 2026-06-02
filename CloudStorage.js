// ==========================================
// CLOUD STORAGE - ECOSISTEMA UNACOM 2.0
// Almacenamiento de fotos en Google Cloud
// ==========================================

// Configuración de Cloud Storage
const CLOUD_CONFIG = {
  BUCKET_NAME: 'unacom-ecosistema-fotos',
  PROJECT_ID: 'project-10d4874c-9194-4717-a4d',
  USE_CLOUD_STORAGE: true  // Cambiar a false si quieres desactivar temporalmente
};

/**
 * Crear el bucket para fotos
 * EJECUTAR UNA SOLA VEZ
 */
function crearBucketFotos() {
  console.log('🚀 Iniciando creación del bucket...');
  console.log('Nombre del bucket:', CLOUD_CONFIG.BUCKET_NAME);
  console.log('Project ID:', CLOUD_CONFIG.PROJECT_ID);
  
  const url = `https://storage.googleapis.com/storage/v1/b?project=${CLOUD_CONFIG.PROJECT_ID}`;
  
  const payload = {
    name: CLOUD_CONFIG.BUCKET_NAME,
    location: 'US',
    storageClass: 'STANDARD'
  };
  
  try {
    const token = ScriptApp.getOAuthToken();
    const response = UrlFetchApp.fetch(url, {
      method: 'POST',
      contentType: 'application/json',
      headers: { Authorization: 'Bearer ' + token },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    });
    
    const codigo = response.getResponseCode();
    const contenido = response.getContentText();
    
    console.log('Código de respuesta:', codigo);
    console.log('Contenido:', contenido);
    
    if (codigo === 200) {
      console.log('✅ Bucket creado exitosamente');
      console.log('🎉 Cloud Storage listo para usar');
      return true;
    } else if (codigo === 409) {
      console.log('⚠️ El bucket ya existe, no hay problema');
      console.log('🎉 Cloud Storage listo para usar');
      return true;
    } else {
      console.error('❌ Error inesperado:', contenido);
      return false;
    }
  } catch (e) {
    console.error('❌ Error creando bucket:', e.toString());
    console.error('Detalles:', e.stack);
    return false;
  }
}

/**
 * Subir una foto a Cloud Storage
 * @param {string} fotoBase64 - La foto en formato base64
 * @param {string} nombreArchivo - Nombre del archivo
 * @param {string} codigoRegistro - Código del registro para la carpeta
 * @return {Object|null} - Datos de la foto subida o null si falló
 */
function subirFotoACloudStorage(fotoBase64, nombreArchivo, codigoRegistro) {
  // Verificar si Cloud Storage está activado
  if (!CLOUD_CONFIG.USE_CLOUD_STORAGE) {
    console.log('ℹ️ Cloud Storage desactivado por configuración');
    return null;
  }
  
  // Validar que tenemos datos
  if (!fotoBase64) {
    console.log('⚠️ No se recibió foto para subir');
    return null;
  }
  
  try {
    // Limpiar nombre de archivo (quitar caracteres especiales)
    const safeFileName = nombreArchivo.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${codigoRegistro}/${safeFileName}`;
    
    console.log(`📤 Subiendo: ${filePath}`);
    
    // Decodificar base64 a bytes
    const blob = Utilities.base64Decode(fotoBase64);
    
    // Construir URL de subida
    const url = `https://storage.googleapis.com/upload/storage/v1/b/${CLOUD_CONFIG.BUCKET_NAME}/o?uploadType=media&name=${encodeURIComponent(filePath)}`;
    
    // Obtener token de autenticación
    const token = ScriptApp.getOAuthToken();
    
    // Subir archivo
    const response = UrlFetchApp.fetch(url, {
      method: 'POST',
      contentType: 'image/jpeg',
      headers: { Authorization: 'Bearer ' + token },
      payload: blob,
      muteHttpExceptions: true
    });
    
    const codigo = response.getResponseCode();
    
    if (codigo === 200) {
      const result = JSON.parse(response.getContentText());
      const urlPublica = `https://storage.googleapis.com/${CLOUD_CONFIG.BUCKET_NAME}/${filePath}`;
      
      console.log(`✅ Foto subida exitosamente`);
      console.log(`📎 URL: ${urlPublica}`);
      
      return {
        url: urlPublica,
        id: result.id,
        nombre: safeFileName,
        tamanio: result.size
      };
    } else {
      console.error(`❌ Error al subir foto. Código: ${codigo}`);
      console.error('Respuesta:', response.getContentText());
      return null;
    }
    
  } catch (e) {
    console.error('❌ Error en Cloud Storage:', e.toString());
    console.error('Stack:', e.stack);
    return null;
  }
}

/**
 * Probar que Cloud Storage funciona correctamente
 */
function testCloudStorage() {
  console.log('🧪 INICIANDO PRUEBA DE CLOUD STORAGE');
  console.log('=====================================');
  
  // 1. Verificar configuración
  console.log('📋 Configuración:');
  console.log('  - Bucket:', CLOUD_CONFIG.BUCKET_NAME);
  console.log('  - Proyecto:', CLOUD_CONFIG.PROJECT_ID);
  console.log('  - Activado:', CLOUD_CONFIG.USE_CLOUD_STORAGE);
  
  // 2. Crear imagen de prueba (un pixel rojo en base64)
  const imagenPrueba = 'R0lGODlhAQABAIAAAP8AAP///yH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
  
  console.log('📤 Intentando subir imagen de prueba...');
  
  // 3. Intentar subir
  const resultado = subirFotoACloudStorage(
    imagenPrueba,
    'test_imagen.jpg',
    'TEST_' + new Date().toISOString().replace(/[:.]/g, '-')
  );
  
  // 4. Verificar resultado
  console.log('=====================================');
  if (resultado) {
    console.log('🎉 CLOUD STORAGE FUNCIONANDO CORRECTAMENTE');
    console.log('✅ URL de la imagen de prueba:', resultado.url);
    console.log('✅ ID:', resultado.id);
    console.log('✅ Puedes verificar la imagen en tu navegador');
  } else {
    console.log('❌ CLOUD STORAGE FALLÓ');
    console.log('⚠️ Verifica:');
    console.log('  1. Que el bucket exista (ejecuta crearBucketFotos primero)');
    console.log('  2. Que los permisos estén configurados');
    console.log('  3. Que el proyecto de Google Cloud esté activo');
  }
  console.log('=====================================');
  
  return resultado;
}

/**
 * Ver el estado actual del Cloud Storage
 */
function estadoCloudStorage() {
  console.log('📊 ESTADO DEL CLOUD STORAGE');
  console.log('============================');
  console.log('Bucket:', CLOUD_CONFIG.BUCKET_NAME);
  console.log('Proyecto:', CLOUD_CONFIG.PROJECT_ID);
  console.log('Activado:', CLOUD_CONFIG.USE_CLOUD_STORAGE);
  
  try {
    const url = `https://storage.googleapis.com/storage/v1/b/${CLOUD_CONFIG.BUCKET_NAME}`;
    const token = ScriptApp.getOAuthToken();
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() === 200) {
      const info = JSON.parse(response.getContentText());
      console.log('✅ Bucket existe');
      console.log('📍 Ubicación:', info.location);
      console.log('💾 Tipo:', info.storageClass);
      console.log('📅 Creado:', info.timeCreated);
    } else {
      console.log('❌ Bucket no encontrado');
      console.log('Ejecuta crearBucketFotos() para crearlo');
    }
  } catch (e) {
    console.error('Error verificando bucket:', e.toString());
  }
}