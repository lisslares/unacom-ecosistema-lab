// ==========================================
// PRUEBAS AUTOMATIZADAS - ECOSISTEMA LABORATORIO v2.0.1
// ==========================================

/**
 * PRUEBA 1: Registro con Contacto Inicial
 * Simula el envío más básico para verificar correo y PDF
 */
function prueba_registro_contacto_inicial() {
  console.log('🧪 INICIANDO PRUEBA: Registro con Contacto Inicial');
  console.log('==================================================');
  
  var payload = {
    metadatos_registro: {
      registrador: "María Gabriela Rodríguez (PRUEBA)",
      telefono: "0412-5556677",
      correo: "liss.lares@gmail.com",  // ← CAMBIA por tu correo para recibir el PDF
      pertenece_unacom: "Sí",
      vicerrectorado: "Vicerrectorado de Democracia y Sociedad Comunal - Dirección de Investigación Social"
    },
    identificacion_experiencia: {
      nombre_experiencia: "PRUEBA - Comité de Agua Comunal",
      fecha_abordaje: "2026-05-11",
      fecha_iniciacion_experiencia: "2018",
      estado: "Miranda",
      municipio: "Carrizal",
      parroquia: "Carrizal",
      comuna_circuito_comunal: "Comuna El Maizal",
      tipo_organizacion: "Consejo Comunal"
    },
    saber_comunero: {
      lineas_sistematizacion: ["contacto_inicial"],
      descripcion_general_saber_hacer: "Primer acercamiento al Comité de Agua Comunal. Se identificó una organización de base que gestiona el suministro de agua potable para 200 familias mediante un sistema de bombeo solar comunitario."
    },
    protagonistas: [
      {
        nombre_portador: "José Gregorio Hernández (PRUEBA)",
        cedula: "12.345.678",
        telefono: "0412-1234567",
        habilidad_saber: "Coordinador del comité de agua",
        nivel_estudio: "Técnico"
      }
    ],
    cierre_y_proyeccion: {
      area_unacom: "Ciencias Sociales",
      pnf_vinculado: ["PNF en Agroecología", "PNF en Ingeniería Ambiental"],
      ruta_trabajo_sugerida: ["Segunda visita en 15 días", "Entrevista a profundidad con fundadores"],
      evidencias_b64: []  // Sin fotos para esta prueba
    }
  };
  
  console.log('📤 Enviando payload de prueba...');
  console.log('Payload:', JSON.stringify(payload, null, 2));
  
  var resultado = procesar_formulario_v2(payload);
  
  console.log('==================================================');
  if (resultado.success) {
    console.log('✅ PRUEBA EXITOSA');
    console.log('🔑 Código generado:', resultado.codigo);
    console.log('📧 Revisa tu correo para verificar el PDF');
    console.log('📊 Revisa la hoja de cálculo para ver la fila');
  } else {
    console.log('❌ PRUEBA FALLIDA');
    console.log('Error:', resultado.error);
  }
  console.log('==================================================');
  
  return resultado;
}

/**
 * PRUEBA 2: Registro con línea específica (Historia de Lucha)
 */
function prueba_registro_historia_lucha() {
  console.log('🧪 INICIANDO PRUEBA: Registro con Historia de Lucha');
  console.log('==================================================');
  
  var payload = {
    metadatos_registro: {
      registrador: "Carlos Mendoza (PRUEBA)",
      telefono: "0416-1112233",
      correo: "liss.lares@gmail.com",  // ← CAMBIA por tu correo
      pertenece_unacom: "Sí",
      vicerrectorado: "Vicerrectorado de Democracia y Sociedad Comunal"
    },
    identificacion_experiencia: {
      nombre_experiencia: "PRUEBA - Asamblea Popular de Gobernanza",
      fecha_abordaje: "2026-05-10",
      fecha_iniciacion_experiencia: "2015",
      estado: "Distrito Capital",
      municipio: "Libertador",
      parroquia: "23 de Enero",
      comuna_circuito_comunal: "Circuito Comunal Cacique Tiuna",
      tipo_organizacion: "Comuna"
    },
    saber_comunero: {
      lineas_sistematizacion: ["historia_lucha"],
      descripcion_general_saber_hacer: "La Asamblea Popular de Gobernanza es un espacio de autogobierno comunal donde se toman decisiones por consenso. Reúne a 15 consejos comunales cada 15 días para planificar el desarrollo territorial.",
      historia_lucha: {
        descripcion_general_practica: "Sistema de asambleas rotativas con metodología de parlamento abierto. Cada consejo comunal envía 2 voceros con poder de decisión.",
        innovacion_en_esta_linea: "Crearon un sistema de registro audiovisual de cada asamblea para garantizar transparencia. Usan un grupo de WhatsApp solo para difusión de acuerdos.",
        retos_solucionados_en_esta_linea: "Lograron reducir los conflictos entre consejos comunales mediante un reglamento interno de convivencia aprobado en asamblea.",
        otra_informacion: "Tienen 7 años funcionando ininterrumpidamente. Han gestionado la construcción de una escuela y un ambulatorio.",
        relato_especifico: "Doña Carmen, fundadora: 'Antes cada quien hacía lo suyo, ahora planificamos juntos. La asamblea es nuestra universidad popular.'"
      }
    },
    protagonistas: [
      {
        nombre_portador: "Carmen Elena Pérez (PRUEBA)",
        cedula: "8.765.432",
        telefono: "0424-9876543",
        habilidad_saber: "Facilitadora de asambleas y mediadora comunal",
        nivel_estudio: "Universitario"
      },
      {
        nombre_portador: "Luis Ramírez (PRUEBA)",
        cedula: "10.123.456",
        telefono: "0412-3456789",
        habilidad_saber: "Registro audiovisual y comunicaciones",
        nivel_estudio: "Técnico"
      }
    ],
    cierre_y_proyeccion: {
      area_unacom: "Ciencias Sociales",
      pnf_vinculado: ["PNF en Administración", "PNF en Informática"],
      ruta_trabajo_sugerida: ["Documentar 3 asambleas", "Crear línea de tiempo histórica"],
      elementos_memoria_historica: [
        {
          tipo_elemento: "Enlace Web o Red Social",
          descripcion_elemento: "Video de asamblea fundacional",
          enlace_o_archivo: "https://youtube.com/ejemplo"
        }
      ],
      evidencias_b64: []
    }
  };
  
  console.log('📤 Enviando payload con Historia de Lucha...');
  
  var resultado = procesar_formulario_v2(payload);
  
  console.log('==================================================');
  if (resultado.success) {
    console.log('✅ PRUEBA EXITOSA');
    console.log('🔑 Código generado:', resultado.codigo);
  } else {
    console.log('❌ PRUEBA FALLIDA');
    console.log('Error:', resultado.error);
  }
  
  return resultado;
}

/**
 * PRUEBA 3: Diagnóstico rápido de todo el sistema
 */
function prueba_diagnostico_rapido() {
  console.log('🔍 DIAGNÓSTICO RÁPIDO DEL SISTEMA');
  console.log('================================');
  
  // 1. Verificar conexiones básicas
  console.log('📁 Verificando Drive...');
  try {
    var carpeta = DriveApp.getFolderById(id_carpeta_maestra);
    console.log('   ✅ Carpeta maestra: ' + carpeta.getName());
  } catch (e) {
    console.log('   ❌ Error Drive: ' + e.toString());
  }
  
  console.log('📊 Verificando Sheets...');
  try {
    var ss = SpreadsheetApp.openById(id_hoja_calculo);
    console.log('   ✅ Hoja de cálculo: ' + ss.getName());
  } catch (e) {
    console.log('   ❌ Error Sheets: ' + e.toString());
  }
  
  console.log('📧 Verificando Gmail...');
  try {
    var cuota = MailApp.getRemainingDailyQuota();
    console.log('   ✅ Correos restantes hoy: ' + cuota);
  } catch (e) {
    console.log('   ❌ Error Gmail: ' + e.toString());
  }
  
  console.log('☁️ Verificando Cloud Storage...');
  try {
    var token = ScriptApp.getOAuthToken();
    var url = 'https://storage.googleapis.com/storage/v1/b/unacom-ecosistema-fotos';
    var resp = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });
    if (resp.getResponseCode() === 200) {
      console.log('   ✅ Bucket Cloud Storage accesible');
    } else {
      console.log('   ⚠️ Bucket responde: ' + resp.getResponseCode());
    }
  } catch (e) {
    console.log('   ❌ Error Cloud Storage: ' + e.toString());
  }
  
  console.log('🔥 Verificando Firestore...');
  try {
    var token = ScriptApp.getOAuthToken();
    var url = 'https://firestore.googleapis.com/v1/projects/project-10d4874c-9194-4717-a4d/databases/ecosistema-lab-2/documents/experiencias_unacom?pageSize=2';
    var resp = UrlFetchApp.fetch(url, {
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });
    if (resp.getResponseCode() === 200) {
      console.log('   ✅ Firestore accesible');
    } else {
      console.log('   ⚠️ Firestore responde: ' + resp.getResponseCode());
    }
  } catch (e) {
    console.log('   ❌ Error Firestore: ' + e.toString());
  }
  
  console.log('================================');
  console.log('🏁 DIAGNÓSTICO COMPLETADO');
}

/**
 * PRUEBA 4: Ejecutar todas las pruebas en secuencia
 */
function ejecutar_todas_las_pruebas() {
  console.log('🚀 INICIANDO BATERÍA COMPLETA DE PRUEBAS');
  console.log('========================================\n');
  
  prueba_diagnostico_rapido();
  console.log('\n');
  
  var r1 = prueba_registro_contacto_inicial();
  console.log('\n');
  
  var r2 = prueba_registro_historia_lucha();
  console.log('\n');
  
  console.log('========================================');
  console.log('📊 RESUMEN FINAL:');
  console.log('   Contacto Inicial: ' + (r1.success ? '✅' : '❌') + ' - Código: ' + (r1.codigo || 'N/A'));
  console.log('   Historia Lucha:   ' + (r2.success ? '✅' : '❌') + ' - Código: ' + (r2.codigo || 'N/A'));
  console.log('========================================');
}

// ==========================================
// FUNCIONES DE LIMPIEZA DE PRUEBAS
// ==========================================

/**
 * LIMPIEZA TOTAL: Borra todas las filas de prueba de la hoja de cálculo
 * Identifica filas que contengan "(PRUEBA)" en cualquier columna
 */
function borrar_filas_prueba_sheets() {
  console.log('🧹 INICIANDO LIMPIEZA DE FILAS DE PRUEBA EN SHEETS');
  console.log('==================================================');
  
  var ss = SpreadsheetApp.openById(id_hoja_calculo);
  var hoja = ss.getSheets()[0];
  var datos = hoja.getDataRange().getValues();
  var filas_a_borrar = [];
  
  // Buscar filas con "(PRUEBA)" - empezamos desde abajo para no desordenar índices
  for (var i = datos.length - 1; i >= 0; i--) {
    var fila = datos[i];
    var filaTexto = fila.join(' '); // Unir toda la fila en un solo texto
    if (filaTexto.indexOf('(PRUEBA)') !== -1 || filaTexto.indexOf('PRUEBA') !== -1) {
      filas_a_borrar.push(i + 1); // +1 porque las filas en Sheets empiezan en 1
      console.log('🔍 Encontrada fila de prueba en posición: ' + (i + 1) + ' - ' + fila[8]); // Columna del nombre de experiencia
    }
  }
  
  // Borrar de abajo hacia arriba
  filas_a_borrar.sort(function(a, b) { return b - a; }); // Ordenar descendente
  filas_a_borrar.forEach(function(fila) {
    hoja.deleteRow(fila);
  });
  
  console.log('✅ Se borraron ' + filas_a_borrar.length + ' filas de prueba');
  console.log('==================================================');
  return filas_a_borrar.length;
}

/**
 * LIMPIEZA DE CARPETAS EN DRIVE
 * Busca y elimina carpetas de prueba en la carpeta maestra
 */
function borrar_carpetas_prueba_drive() {
  console.log('🧹 INICIANDO LIMPIEZA DE CARPETAS DE PRUEBA EN DRIVE');
  console.log('==================================================');
  
  var carpetaMaestra = DriveApp.getFolderById(id_carpeta_maestra);
  var carpetasEliminadas = 0;
  
  // Recorrer subcarpetas de cada estado
  var carpetasEstado = carpetaMaestra.getFolders();
  while (carpetasEstado.hasNext()) {
    var carpetaEstado = carpetasEstado.next();
    var carpetasExperiencia = carpetaEstado.getFolders();
    
    while (carpetasExperiencia.hasNext()) {
      var carpetaExp = carpetasExperiencia.next();
      var nombre = carpetaExp.getName();
      
      if (nombre.indexOf('PRUEBA') !== -1 || nombre.indexOf('TEST_') !== -1) {
        console.log('🗑️ Eliminando carpeta: ' + nombre);
        carpetaExp.setTrashed(true); // Mover a papelera (más seguro)
        carpetasEliminadas++;
      }
    }
  }
  
  console.log('✅ Se eliminaron ' + carpetasEliminadas + ' carpetas de prueba');
  console.log('==================================================');
  return carpetasEliminadas;
}

/**
 * LIMPIEZA DE DOCUMENTOS DE PRUEBA EN FIRESTORE
 */
function borrar_documentos_prueba_firestore() {
  console.log('🧹 INICIANDO LIMPIEZA DE DOCUMENTOS DE PRUEBA EN FIRESTORE');
  console.log('==================================================');
  
  try {
    var projectId = "project-10d4874c-9194-4717-a4d";
    var database = "ecosistema-lab-2";
    var token = ScriptApp.getOAuthToken();
    
    // Primero listar documentos
    var url_list = "https://firestore.googleapis.com/v1/projects/" + projectId + "/databases/" + database + "/documents/experiencias_unacom?pageSize=100";
    
    var respuesta = UrlFetchApp.fetch(url_list, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
      muteHttpExceptions: true
    });
    
    if (respuesta.getResponseCode() === 200) {
      var data = JSON.parse(respuesta.getContentText());
      var documentos = data.documents || [];
      var borrados = 0;
      
      for (var i = 0; i < documentos.length; i++) {
        var doc = documentos[i];
        var docName = doc.name || '';
        
        // Buscar documentos que contengan PRUEBA en el ID o en los campos
        var docId = docName.split('/').pop();
        var nombreExp = '';
        
        try {
          nombreExp = doc.fields.identificacion_experiencia.mapValue.fields.nombre_experiencia.stringValue || '';
        } catch (e) {
          // No hacer nada si no se puede leer
        }
        
        if (docId.indexOf('UNACOM-') !== -1 && (nombreExp.indexOf('PRUEBA') !== -1 || docId.indexOf('TEST') !== -1)) {
          var url_delete = "https://firestore.googleapis.com/v1/" + docName;
          
          UrlFetchApp.fetch(url_delete, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + token },
            muteHttpExceptions: true
          });
          
          console.log('🗑️ Eliminado documento Firestore: ' + docId);
          borrados++;
        }
      }
      
      console.log('✅ Se eliminaron ' + borrados + ' documentos de Firestore');
    } else {
      console.log('⚠️ No se pudieron listar documentos: ' + respuesta.getContentText());
    }
    
  } catch (e) {
    console.log('❌ Error en Firestore: ' + e.toString());
  }
  
  console.log('==================================================');
}

/**
 * LIMPIEZA DE FOTOS EN CLOUD STORAGE
 */
function borrar_fotos_prueba_cloud() {
  console.log('🧹 INICIANDO LIMPIEZA DE FOTOS DE PRUEBA EN CLOUD STORAGE');
  console.log('==================================================');
  
  try {
    var bucketName = 'unacom-ecosistema-fotos';
    var token = ScriptApp.getOAuthToken();
    
    // Listar objetos en el bucket
    var url = 'https://storage.googleapis.com/storage/v1/b/' + bucketName + '/o?prefix=UNACOM-&maxResults=200';
    var respuesta = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + token },
      muteHttpExceptions: true
    });
    
    if (respuesta.getResponseCode() === 200) {
      var data = JSON.parse(respuesta.getContentText());
      var items = data.items || [];
      var borrados = 0;
      
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        // Borrar carpetas de TEST
        if (item.name && (item.name.indexOf('TEST_') !== -1 || item.name.indexOf('Evidencia') === -1)) {
          continue; // Saltamos para borrar solo lo que queramos
        }
        // Aquí puedes añadir lógica específica si quieres borrar algo
      }
      
      console.log('⚠️ La limpieza de Cloud Storage es delicada. Se recomienda revisar manualmente en:');
      console.log('   https://console.cloud.google.com/storage/browser/' + bucketName);
    }
    
  } catch (e) {
    console.log('⚠️ Error listando Cloud Storage: ' + e.toString());
  }
  
  console.log('==================================================');
}

/**
 * 🚀 LIMPIEZA TOTAL - EJECUTA TODO DE UNA VEZ
 * ¡Usar con precaución!
 */
function limpieza_total_sistema() {
  console.log('🗑️ INICIANDO LIMPIEZA TOTAL DEL SISTEMA');
  console.log('⚠️ ESTO BORRARÁ TODOS LOS DATOS DE PRUEBA');
  console.log('==========================================\n');
  
  var filas = borrar_filas_prueba_sheets();
  console.log('');
  
  var carpetas = borrar_carpetas_prueba_drive();
  console.log('');
  
  var docs = borrar_documentos_prueba_firestore();
  console.log('');
  
  console.log('==========================================');
  console.log('📊 RESUMEN DE LIMPIEZA:');
  console.log('   📊 Filas eliminadas en Sheets: ' + filas);
  console.log('   📁 Carpetas eliminadas en Drive: ' + carpetas);
  console.log('==========================================');
  console.log('✅ LIMPIEZA COMPLETADA');
  console.log('');
  console.log('💡 Las carpetas de Drive se enviaron a la papelera.');
  console.log('   Para eliminarlas definitivamente, vacía la papelera de Drive.');
  console.log('💡 Para Cloud Storage, revisa manualmente en Google Cloud Console.');
}

/**
 * LIMPIEZA SEGURA - Solo sheets (lo más común)
 */
function limpieza_rapida_sheets() {
  console.log('🧹 LIMPIEZA RÁPIDA - Solo Sheets');
  var filas = borrar_filas_prueba_sheets();
  console.log('✅ ' + filas + ' filas de prueba eliminadas de la hoja de cálculo');
}