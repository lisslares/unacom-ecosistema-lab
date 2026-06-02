// ==========================================
// VARIABLES DE ENTORNO INSTITUCIONALES
// ==========================================
const id_carpeta_maestra = "13qEA4wq3XSVf5AceLnra-xZI3O75wBnr";
const id_plantilla_doc = "1Wns70daRl8Ggp3ut37ZZ9HHHuV9BVid9bY9PxArpaS0";
const id_hoja_calculo = "1lfth3QW7LfXPMGsFKZeU-Ipnat4vkWbuTVPPs6BvYjE";

// ==========================================
// 1. SERVIDOR DEL FRONTEND
// ==========================================
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Ecosistema UNACOM 2.0.1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
}

// ==========================================
// 2. MOTOR DE PROCESAMIENTO PRINCIPAL
// ==========================================
function procesar_formulario_v2(payload) {
  try {
    // ========== 1. ASEGURAR QUE EXISTAN LOS OBJETOS ==========
    if (!payload.metadatos_registro) payload.metadatos_registro = {};
    if (!payload.identificacion_experiencia) payload.identificacion_experiencia = {};
    if (!payload.saber_comunero) payload.saber_comunero = {};
    if (!payload.cierre_y_proyeccion) payload.cierre_y_proyeccion = {};
    if (!payload.protagonistas) payload.protagonistas = [];
    
    // ========== 2. DEFINIR VARIABLES ANTES DE USARLAS ==========
    var iden = payload.identificacion_experiencia || {};
    var meta = payload.metadatos_registro || {};
    var saber = payload.saber_comunero || {};
    var cierre = payload.cierre_y_proyeccion || {};
    var protas = payload.protagonistas || [];
    
    // ========== 3. DATOS DE LOS PROTAGONISTAS ==========
    var primer_portador = protas.length > 0 ? protas[0] : {};
    var nombre_portador = primer_portador.nombre_portador || "";
    if (protas.length > 1) {
      nombre_portador += " +" + (protas.length - 1) + " más";
    }
    
    // ========== 4. LÍNEAS DE SISTEMATIZACIÓN ==========
    var lineas_sistematizacion_array = saber.lineas_sistematizacion || [];
    var lineas_texto = lineas_sistematizacion_array.join(", ");
    
    // ========== 5. EXTRAER DATOS DE CADA LÍNEA ==========
    var descripcion_general = "";
    var retos_solucionados = "";
    var innovacion = "";
    var otra_info = "";
    var relato = "";
    
    var lineasMap = {
      'historia_lucha': 'hl',
      'haceres_saberes': 'hs',
      'feminismo_comunal': 'fc',
      'innovacion_popular': 'in'
    };
    
    for (var linea in lineasMap) {
      if (saber[linea]) {
        var datosLinea = saber[linea];
        descripcion_general = datosLinea.descripcion_general_practica || "";
        retos_solucionados = datosLinea.retos_solucionados_en_esta_linea || "";
        innovacion = datosLinea.innovacion_en_esta_linea || "";
        otra_info = datosLinea.otra_informacion || "";
        relato = datosLinea.relato_especifico || "";
        break;
      }
    }
    
    if (!descripcion_general && saber.descripcion_general_saber_hacer) {
      descripcion_general = saber.descripcion_general_saber_hacer;
    }
    
    // ========== 6. IDENTIDAD INSTITUCIONAL ==========
    var fecha_actual = new Date();
    var anio = fecha_actual.getFullYear();
    var estado_siglas = iden.estado ? iden.estado.substring(0, 3).toUpperCase() : "XXX";
    var numero_aleatorio = Math.floor(1000 + Math.random() * 9000);
    var codigo_registro = `UNACOM-${estado_siglas}-${anio}-${numero_aleatorio}`;
    
    meta.codigo_registro = codigo_registro;
    meta.fecha_creacion = fecha_actual;
    
    // ========== 7. ENRUTAMIENTO EN GOOGLE DRIVE ==========
    var carpeta_maestra = DriveApp.getFolderById(id_carpeta_maestra);
    var nombre_estado = iden.estado || "Sin Estado";
    var nombre_experiencia = iden.nombre_experiencia || "Sin Nombre";
    
    var carpetas_estado = carpeta_maestra.searchFolders("title = '" + nombre_estado + "'");
    var carpeta_estado = carpetas_estado.hasNext() ? carpetas_estado.next() : carpeta_maestra.createFolder(nombre_estado);
    var carpeta_experiencia = carpeta_estado.createFolder(codigo_registro + " - " + nombre_experiencia);
    
    meta.id_carpeta_drive = carpeta_experiencia.getId();
    
    // ========== 8. GUARDADO DE EVIDENCIAS (DRIVE + CLOUD STORAGE) ==========
    if (cierre.evidencias_b64 && cierre.evidencias_b64.length > 0) {
      var evidencias_cloud = [];
      var evidencias_drive = [];
      
      cierre.evidencias_b64.forEach(function (foto, index) {
        if (!foto || !foto.b64) return;
        
        var nombreArchivo = `${codigo_registro}_Evidencia_${index + 1}`;
        
        try {
          var resultadoCloud = subirFotoACloudStorage(
            foto.b64,
            nombreArchivo + '.jpg',
            codigo_registro
          );
          if (resultadoCloud) {
            evidencias_cloud.push(resultadoCloud);
          }
        } catch (e) {
          Logger.log('⚠️ Error Cloud Storage en evidencia ' + index + ': ' + e.toString());
        }
        
        try {
          var blob = Utilities.base64Decode(foto.b64);
          var archivo_blob = Utilities.newBlob(blob, foto.mime || 'image/jpeg', nombreArchivo);
          var archivoDrive = carpeta_experiencia.createFile(archivo_blob);
          evidencias_drive.push({
            id: archivoDrive.getId(),
            url: archivoDrive.getUrl()
          });
        } catch (e) {
          Logger.log('⚠️ Error Drive en evidencia ' + index + ': ' + e.toString());
        }
      });
      
      meta.evidencias_cloud = evidencias_cloud;
      meta.evidencias_drive = evidencias_drive;
      
      Logger.log('📊 Evidencias procesadas: ' + cierre.evidencias_b64.length + 
                  ' | Cloud: ' + evidencias_cloud.length + 
                  ' | Drive: ' + evidencias_drive.length);
    }
    
    // ========== 9. GENERACIÓN DEL REPORTE PDF ==========
    var archivo_plantilla = DriveApp.getFileById(id_plantilla_doc);
    var copia_doc = archivo_plantilla.makeCopy(`Informe_${codigo_registro}`, carpeta_experiencia);
    var documento = DocumentApp.openById(copia_doc.getId());
    var cuerpo = documento.getBody();
    
    cuerpo.replaceText("{{id_registro}}", codigo_registro);
    cuerpo.replaceText("{{marca_temporal}}", Utilities.formatDate(fecha_actual, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss"));
    cuerpo.replaceText("{{nombre_registrador}}", meta.registrador || "");
    cuerpo.replaceText("{{telefono_contacto}}", meta.telefono || "");
    cuerpo.replaceText("{{correo_electronico}}", meta.correo || "");
    cuerpo.replaceText("{{pertenece_unacom}}", meta.pertenece_unacom || "");
    cuerpo.replaceText("{{vicerrectorado_direccion}}", meta.vicerrectorado || "");
    cuerpo.replaceText("{{nombre_experiencia}}", iden.nombre_experiencia || "");
    cuerpo.replaceText("{{fecha_abordaje}}", iden.fecha_abordaje || "");
    cuerpo.replaceText("{{estado}}", iden.estado || "");
    cuerpo.replaceText("{{municipio}}", iden.municipio || "");
    cuerpo.replaceText("{{parroquia}}", iden.parroquia || "");
    cuerpo.replaceText("{{comuna_circuito_comunal}}", iden.comuna_circuito_comunal || "");
    cuerpo.replaceText("{{tipo_organizacion}}", iden.tipo_organizacion || "");
    cuerpo.replaceText("{{lineas_sistematizacion}}", lineas_texto);
    cuerpo.replaceText("{{descripcion_general_practica}}", descripcion_general);
    cuerpo.replaceText("{{retos_solucionados_en_esta_linea}}", retos_solucionados);
    cuerpo.replaceText("{{innovacion_en_esta_linea}}", innovacion);
    cuerpo.replaceText("{{otra_informacion}}", otra_info);
    cuerpo.replaceText("{{nombre_portador}}", nombre_portador);
    cuerpo.replaceText("{{relato_especifico}}", relato);
    cuerpo.replaceText("{{area_unacom}}", cierre.area_unacom || "");
    cuerpo.replaceText("{{pnf_vinculado}}", (Array.isArray(cierre.pnf_vinculado) ? cierre.pnf_vinculado.join(", ") : (cierre.pnf_vinculado || "")));
    cuerpo.replaceText("{{ruta_trabajo_sugerida}}", (cierre.ruta_trabajo_sugerida || []).join(" | "));
    
    cuerpo.replaceText("{{CODIGO}}", codigo_registro);
    cuerpo.replaceText("{{NOMBRE_EXPERIENCIA}}", iden.nombre_experiencia || "");
    cuerpo.replaceText("{{REGISTRADOR_NOMBRE}}", meta.registrador || "");
    cuerpo.replaceText("{{REGISTRADOR_TLF}}", meta.telefono || "");
    cuerpo.replaceText("{{REGISTRADOR_UNACOM}}", meta.pertenece_unacom || "");
    cuerpo.replaceText("{{ESTADO}}", iden.estado || "");
    cuerpo.replaceText("{{MUNICIPIO}}", iden.municipio || "");
    cuerpo.replaceText("{{PARROQUIA}}", iden.parroquia || "");
    cuerpo.replaceText("{{COMUNA}}", iden.comuna_circuito_comunal || "");
    cuerpo.replaceText("{{TIPO_ORGANIZACION}}", iden.tipo_organizacion || "");
    cuerpo.replaceText("{{LINEAS_TRABAJO}}", lineas_texto);
    cuerpo.replaceText("{{DESCRIPCION_SABER}}", descripcion_general);
    cuerpo.replaceText("{{RETOS_SOLUCIONES}}", retos_solucionados);
    cuerpo.replaceText("{{INNOVACION_POPULAR}}", innovacion);
    cuerpo.replaceText("{{OTRA_INFO}}", otra_info);
    cuerpo.replaceText("{{LISTA_COMUNEROS}}", nombre_portador);
    cuerpo.replaceText("{{AREA_UNACOM}}", cierre.area_unacom || "");
    cuerpo.replaceText("{{PNF_VINCULADO}}", (Array.isArray(cierre.pnf_vinculado) ? cierre.pnf_vinculado.join(", ") : (cierre.pnf_vinculado || "")));
    cuerpo.replaceText("{{RUTA_TRABAJO}}", (cierre.ruta_trabajo_sugerida || []).join(" | "));
    cuerpo.replaceText("{{ESTATUS}}", "ACTIVO");
    
    documento.saveAndClose();
    
    // ========== 10. ESCRITURA EN GOOGLE SHEETS ==========
    var fila_completa = [
      codigo_registro,
      fecha_actual,
      meta.registrador || "",
      meta.telefono || "",
      meta.correo || "",
      meta.pertenece_unacom || "",
      meta.vicerrectorado || "",
      iden.nombre_experiencia || "",
      iden.fecha_abordaje || fecha_actual,
      iden.estado || "",
      iden.municipio || "",
      iden.parroquia || "",
      iden.comuna_circuito_comunal || "",
      iden.tipo_organizacion || "",
      lineas_texto,
      descripcion_general,
      retos_solucionados,
      innovacion,
      otra_info,
      nombre_portador,
      relato,
      cierre.area_unacom || "",
      Array.isArray(cierre.pnf_vinculado) ? cierre.pnf_vinculado.join(", ") : (cierre.pnf_vinculado || ""),
      (cierre.ruta_trabajo_sugerida || []).join(" | "),
      meta.id_carpeta_drive || "",
      (evidencias_cloud || []).map(function(e) { return e.url || ""; }).join(" | "),
      (evidencias_drive || []).map(function(e) { return e.url || ""; }).join(" | "),
      "",
      "",
      ""
    ];
    
    var hoja = SpreadsheetApp.openById(id_hoja_calculo).getSheets()[0];
    hoja.appendRow(fila_completa);

    // ========== 11. NOTIFICACIÓN POR CORREO ==========
    var pdfBlob = copia_doc.getBlob();
    pdfBlob.setName(`Informe_${codigo_registro}.pdf`);
    var correo_destino = meta.correo;
    if (correo_destino) {
      GmailApp.sendEmail(
        correo_destino, 
        `Registro UNACOM Exitoso: ${codigo_registro}`, 
        "Adjuntamos el respaldo de su registro.\n\nCódigo: " + codigo_registro + "\n\nGracias por contribuir al Ecosistema UNACOM.",
        {
          attachments: [pdfBlob]
        }
      );
    }
    
    // ========== 12. ESCRITURA EN FIRESTORE ==========
    try {
      var projectId = "project-10d4874c-9194-4717-a4d";
      var database = "ecosistema-lab-2";
      var token = ScriptApp.getOAuthToken();
      var firestore_url = "https://firestore.googleapis.com/v1/projects/" + projectId + "/databases/" + database + "/documents/experiencias_unacom?documentId=" + codigo_registro;
      
      var doc_firestore = {
        fields: {
          identificacion_experiencia: {
            mapValue: {
              fields: {
                nombre_experiencia: { stringValue: iden.nombre_experiencia || "" },
                estado: { stringValue: iden.estado || "" },
                municipio: { stringValue: iden.municipio || "" },
                parroquia: { stringValue: iden.parroquia || "" },
                comuna_circuito_comunal: { stringValue: iden.comuna_circuito_comunal || "" },
                tipo_organizacion: { stringValue: iden.tipo_organizacion || "" },
                fecha_abordaje: { timestampValue: fecha_actual.toISOString() },
                fecha_iniciacion_experiencia: { stringValue: iden.fecha_iniciacion_experiencia || "" },
                lineas_sistematizacion: {
                  arrayValue: {
                    values: lineas_sistematizacion_array.map(function (l) { return { stringValue: l }; })
                  }
                }
              }
            }
          },
          saber_comunero: {
            mapValue: {
              fields: {
                descripcion_general: { stringValue: descripcion_general },
                innovacion: { stringValue: innovacion },
                otra_informacion: { stringValue: otra_info },
                relato_especifico: { stringValue: relato },
                retos_solucionados: { stringValue: retos_solucionados }
              }
            }
          },
          protagonistas: {
            arrayValue: {
              values: protas.map(function (p) {
                return {
                  mapValue: {
                    fields: {
                      nombre_portador: { stringValue: p.nombre_portador || "" },
                      cedula: { stringValue: p.cedula || "" },
                      telefono: { stringValue: p.telefono || "" },
                      nivel_estudio: { stringValue: p.nivel_estudio || "" },
                      habilidad_saber: { stringValue: p.habilidad_saber || "" }
                    }
                  }
                };
              })
            }
          },
          cierre_y_proyeccion: {
            mapValue: {
              fields: {
                area_unacom: { stringValue: cierre.area_unacom || "" },
                pnf_vinculado: { stringValue: Array.isArray(cierre.pnf_vinculado) ? cierre.pnf_vinculado.join(", ") : "" }
              }
            }
          },
          datos_sistema: {
            mapValue: {
              fields: {
                codigo_registro: { stringValue: codigo_registro },
                fecha_creacion: { timestampValue: fecha_actual.toISOString() },
                registrador: { stringValue: meta.registrador || "" },
                correo: { stringValue: meta.correo || "" },
                id_carpeta_drive: { stringValue: meta.id_carpeta_drive || "" }
              }
            }
          }
        }
      };
      
      UrlFetchApp.fetch(firestore_url, {
        method: "post",
        contentType: "application/json",
        headers: { Authorization: "Bearer " + token },
        payload: JSON.stringify(doc_firestore),
        muteHttpExceptions: true
      });
      
      Logger.log("✅ Firestore: Documento " + codigo_registro + " guardado");
    } catch (e_fs) {
      Logger.log("⚠️ Error Firestore: " + e_fs.toString());
    }
    
    return { success: true, codigo: codigo_registro };
    
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

// ==========================================
// 3. DICCIONARIO TERRITORIAL
// ==========================================
function obtener_diccionario_territorial() {
  try {
    var ss = SpreadsheetApp.openById(id_hoja_calculo);
    var hoja = ss.getSheetByName("Territorio");
    
    if (!hoja) {
      Logger.log("ERROR: No se encontró la hoja 'Territorio'");
      return {
        "Miranda": { "Carrizal": ["Carrizal"] },
        "Carabobo": { "Valencia": ["Candelaria"] },
        "Distrito Capital": { "Libertador": ["El Valle", "23 de Enero"] }
      };
    }
    
    var datos = hoja.getDataRange().getValues();
    var mapa = {};
    
    for (var i = 1; i < datos.length; i++) {
      var estado = datos[i][0];
      var municipio = datos[i][1];
      var parroquia = datos[i][2];
      
      if (!estado) continue;
      if (!mapa[estado]) mapa[estado] = {};
      if (!mapa[estado][municipio]) mapa[estado][municipio] = [];
      
      if (parroquia && mapa[estado][municipio].indexOf(parroquia) === -1) {
        mapa[estado][municipio].push(parroquia);
      }
    }
    
    Logger.log("Territorio cargado: " + Object.keys(mapa).length + " estados");
    return mapa;
    
  } catch (error) {
    Logger.log("ERROR en obtener_diccionario_territorial: " + error.toString());
    return {
      "Miranda": { "Carrizal": ["Carrizal"] },
      "Carabobo": { "Valencia": ["Candelaria"] }
    };
  }
}

// ==========================================
// 4. DIAGNÓSTICO DEL SISTEMA
// ==========================================
function testSistemaCompleto() {
  var resultados = [];
  var todoOk = true;
  
  try {
    var diccionario = obtener_diccionario_territorial();
    var estados = Object.keys(diccionario);
    resultados.push("✅ Diccionario Territorial: " + estados.length + " estados");
  } catch (e) {
    todoOk = false;
    resultados.push("❌ Diccionario: " + e.toString());
  }
  
  try {
    var carpeta = DriveApp.getFolderById(id_carpeta_maestra);
    resultados.push("✅ Carpeta Maestra: " + carpeta.getName());
  } catch (e) {
    todoOk = false;
    resultados.push("❌ Carpeta: " + e.toString());
  }
  
  try {
    var plantilla = DriveApp.getFileById(id_plantilla_doc);
    resultados.push("✅ Plantilla SIS: " + plantilla.getName());
  } catch (e) {
    todoOk = false;
    resultados.push("❌ Plantilla: " + e.toString());
  }
  
  try {
    var ss = SpreadsheetApp.openById(id_hoja_calculo);
    var hojas = ss.getSheets().map(function (h) { return h.getName(); });
    resultados.push("✅ Hoja Principal: " + hojas.join(", "));
  } catch (e) {
    todoOk = false;
    resultados.push("❌ Hoja: " + e.toString());
  }
  
  try {
    var cuota = MailApp.getRemainingDailyQuota();
    resultados.push("✅ Gmail: " + cuota + " correos restantes");
  } catch (e) {
    todoOk = false;
    resultados.push("❌ Gmail: " + e.toString());
  }
  
  var estado = todoOk ? "🎉 SISTEMA COMPLETAMENTE OPERATIVO" : "⚠️ SISTEMA CON FALLOS";
  resultados.unshift("=== DIAGNÓSTICO ECOSISTEMA UNACOM 2.0 ===");
  resultados.push("=== RESULTADO: " + estado + " ===");
  Logger.log(resultados.join("\n"));
  return resultados.join("\n");
}

// ==========================================
// LIMPIEZA TOTAL - Borra TODOS los registros existentes
// ¡USA CON CUIDADO! Esto borrará datos sin preguntar
// ==========================================

/**
 * BORRAR TODOS LOS REGISTROS DE LA HOJA
 * Esto elimina todas las filas excepto los encabezados
 */
function borrar_todos_los_registros_sheets() {
  console.log('🗑️ BORRANDO TODOS LOS REGISTROS DE SHEETS');
  console.log('==========================================');
  
  try {
    var ss = SpreadsheetApp.openById(id_hoja_calculo);
    var hoja = ss.getSheets()[0];
    var datos = hoja.getDataRange().getValues();
    
    if (datos.length <= 1) {
      console.log('ℹ️ Solo hay encabezados, nada que borrar');
      return 0;
    }
    
    // Contar cuántas filas de datos hay (excluyendo encabezado)
    var filasDatos = datos.length - 1;
    console.log('📊 Se encontraron ' + filasDatos + ' registros para borrar');
    
    // Mostrar primeros 5 registros que se van a borrar
    for (var i = 1; i < Math.min(datos.length, 6); i++) {
      console.log('   📍 ' + datos[i][0] + ' - ' + datos[i][8] + ' - ' + datos[i][2]);
    }
    if (filasDatos > 5) {
      console.log('   ... y ' + (filasDatos - 5) + ' registros más');
    }
    
    // Borrar todas las filas de datos (de abajo hacia arriba)
    for (var i = datos.length - 1; i >= 1; i--) {
      hoja.deleteRow(i + 1);
    }
    
    console.log('✅ Eliminadas ' + filasDatos + ' filas');
    return filasDatos;
    
  } catch (e) {
    console.log('❌ Error: ' + e.toString());
    return 0;
  }
}

/**
 * BORRAR TODAS LAS CARPETAS DE DRIVE
 * Elimina TODAS las carpetas de experiencia dentro de cada estado
 */
function borrar_todas_las_carpetas_drive() {
  console.log('🗑️ BORRANDO TODAS LAS CARPETAS DE DRIVE');
  console.log('========================================');
  
  var carpetasEliminadas = 0;
  var estadosVacios = 0;
  
  try {
    var carpetaMaestra = DriveApp.getFolderById(id_carpeta_maestra);
    var carpetasEstado = carpetaMaestra.getFolders();
    
    while (carpetasEstado.hasNext()) {
      var carpetaEstado = carpetasEstado.next();
      console.log('📁 Procesando estado: ' + carpetaEstado.getName());
      
      var carpetasExperiencia = carpetaEstado.getFolders();
      var carpetasAEliminar = [];
      
      // Recolectar todas las carpetas de experiencia
      while (carpetasExperiencia.hasNext()) {
        carpetasAEliminar.push(carpetasExperiencia.next());
      }
      
      if (carpetasAEliminar.length > 0) {
        console.log('   🗑️ Eliminando ' + carpetasAEliminar.length + ' carpetas...');
        
        for (var i = 0; i < carpetasAEliminar.length; i++) {
          var carpeta = carpetasAEliminar[i];
          console.log('      - ' + carpeta.getName());
          
          // Vaciar archivos primero
          var archivos = carpeta.getFiles();
          while (archivos.hasNext()) {
            archivos.next().setTrashed(true);
          }
          
          carpeta.setTrashed(true);
          carpetasEliminadas++;
        }
        
        // Si la carpeta de estado quedó vacía, también la eliminamos
        if (!carpetaEstado.getFolders().hasNext() && !carpetaEstado.getFiles().hasNext()) {
          console.log('   📁 Estado vacío, eliminando: ' + carpetaEstado.getName());
          carpetaEstado.setTrashed(true);
          estadosVacios++;
        }
      } else {
        console.log('   ℹ️ Sin carpetas en ' + carpetaEstado.getName());
      }
    }
    
    console.log('✅ Eliminadas ' + carpetasEliminadas + ' carpetas de experiencia');
    console.log('✅ Eliminados ' + estadosVacios + ' estados vacíos');
    
  } catch (e) {
    console.log('❌ Error en Drive: ' + e.toString());
  }
  
  return carpetasEliminadas;
}

/**
 * BORRAR DOCUMENTOS DE FIRESTORE
 * Configuración corregida según tus capturas
 */
function borrar_todos_los_documentos_firestore() {
  console.log('🗑️ BORRANDO DOCUMENTOS DE FIRESTORE');
  console.log('====================================');
  
  var borrados = 0;
  
  try {
    // Según tu captura de Firestore, el ID correcto es:
    // "My First Project" con ID "project-10d4874c-9194-4717-ad4"
    var projectId = "project-10d4874c-9194-4717-ad4";  // CORREGIDO
    var database = "ecosistema-lab-2";
    
    console.log('📋 Configuración Firestore:');
    console.log('   Project ID: ' + projectId);
    console.log('   Database: ' + database);
    
    var token = ScriptApp.getOAuthToken();
    
    // Listar documentos
    var url_list = "https://firestore.googleapis.com/v1/projects/" + projectId + 
                   "/databases/" + database + "/documents/experiencias_unacom?pageSize=100";
    
    var respuesta = UrlFetchApp.fetch(url_list, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
      muteHttpExceptions: true
    });
    
    console.log('📡 Respuesta código: ' + respuesta.getResponseCode());
    
    if (respuesta.getResponseCode() === 200) {
      var data = JSON.parse(respuesta.getContentText());
      var documentos = data.documents || [];
      
      console.log('📄 Documentos encontrados: ' + documentos.length);
      
      for (var i = 0; i < documentos.length; i++) {
        var doc = documentos[i];
        var docName = doc.name || '';
        var docId = docName.split('/').pop();
        
        console.log('   🗑️ Eliminando: ' + docId);
        
        var url_delete = "https://firestore.googleapis.com/v1/" + docName;
        
        var deleteResp = UrlFetchApp.fetch(url_delete, {
          method: "DELETE",
          headers: { Authorization: "Bearer " + token },
          muteHttpExceptions: true
        });
        
        if (deleteResp.getResponseCode() === 200) {
          borrados++;
          console.log('      ✅ Eliminado');
        } else {
          console.log('      ⚠️ Error: ' + deleteResp.getResponseCode());
        }
      }
      
      console.log('✅ Eliminados ' + borrados + ' documentos de Firestore');
      
    } else {
      console.log('⚠️ Firestore no accesible. Código: ' + respuesta.getResponseCode());
      console.log('   Respuesta: ' + respuesta.getContentText());
      console.log('');
      console.log('💡 Para habilitar Firestore, ve a:');
      console.log('   https://console.cloud.google.com/firestore');
      console.log('   y selecciona el proyecto "My First Project"');
    }
    
  } catch (e) {
    console.log('❌ Error en Firestore: ' + e.toString());
  }
  
  return borrados;
}

/**
 * 🚨 LIMPIEZA TOTAL - Borra TODOS los datos
 * ¡ESTA ES LA FUNCIÓN PRINCIPAL QUE DEBES EJECUTAR!
 */
function limpieza_total_absoluta() {
  console.log('🚨🚨🚨 LIMPIEZA TOTAL ABSOLUTA 🚨🚨🚨');
  console.log('⚠️⚠️⚠️ ESTO BORRARÁ TODOS LOS DATOS EXISTENTES ⚠️⚠️⚠️');
  console.log('==================================================');
  console.log('');
  console.log('🔴 ¿Estás seguro? Esta acción NO se puede deshacer.');
  console.log('🔴 Se borrarán:');
  console.log('   - TODAS las filas de la hoja de cálculo');
  console.log('   - TODAS las carpetas de Drive dentro del ecosistema');
  console.log('   - TODOS los documentos de Firestore (si está configurado)');
  console.log('');
  console.log('💡 Para continuar, ejecuta "confirmar_limpieza_total()"');
  console.log('==================================================');
}

/**
 * CONFIRMACIÓN - Ejecuta esto después de revisar
 */
function confirmar_limpieza_total() {
  console.log('🚨 EJECUTANDO LIMPIEZA TOTAL CONFIRMADA 🚨');
  console.log('==========================================');
  
  var resultados = {
    sheets: 0,
    drive: 0,
    firestore: 0
  };
  
  // 1. Borrar Sheets
  console.log('\n📊 1. BORRANDO HOJA DE CÁLCULO...');
  resultados.sheets = borrar_todos_los_registros_sheets();
  
  // 2. Borrar Drive
  console.log('\n📁 2. BORRANDO CARPETAS DE DRIVE...');
  resultados.drive = borrar_todas_las_carpetas_drive();
  
  // 3. Borrar Firestore (si se puede)
  console.log('\n🔥 3. BORRANDO FIRESTORE...');
  resultados.firestore = borrar_todos_los_documentos_firestore();
  
  console.log('\n==========================================');
  console.log('📊 RESUMEN FINAL DE LIMPIEZA:');
  console.log('   📊 Sheets: ' + resultados.sheets + ' registros eliminados');
  console.log('   📁 Drive: ' + resultados.drive + ' carpetas eliminadas');
  console.log('   🔥 Firestore: ' + resultados.firestore + ' documentos eliminados');
  console.log('==========================================');
  console.log('✅ LIMPIEZA COMPLETADA');
  
  return resultados;
}

/**
 * Versión más suave - Solo borra carpetas de prueba específicas
 * Basado en los nombres que veo en tus capturas
 */
function borrar_carpetas_especificas_drive() {
  console.log('🗑️ BORRANDO CARPETAS ESPECÍFICAS');
  console.log('================================');
  
  var carpetasAEliminar = [
    'Yaraicu', 'Monagas', 'Miranda', 'Mérida', 'Lara', 
    'Distrito Capital', 'Barinas'
  ];
  
  var eliminadas = 0;
  
  try {
    var carpetaMaestra = DriveApp.getFolderById(id_carpeta_maestra);
    
    for (var i = 0; i < carpetasAEliminar.length; i++) {
      var nombreEstado = carpetasAEliminar[i];
      var busqueda = carpetaMaestra.getFoldersByName(nombreEstado);
      
      if (busqueda.hasNext()) {
        var carpetaEstado = busqueda.next();
        console.log('📁 Procesando: ' + nombreEstado);
        
        // Eliminar todas las carpetas dentro
        var subcarpetas = carpetaEstado.getFolders();
        while (subcarpetas.hasNext()) {
          var carpeta = subcarpetas.next();
          console.log('   🗑️ Eliminando: ' + carpeta.getName());
          
          // Vaciar archivos
          var archivos = carpeta.getFiles();
          while (archivos.hasNext()) {
            archivos.next().setTrashed(true);
          }
          
          carpeta.setTrashed(true);
          eliminadas++;
        }
        
        // Eliminar la carpeta del estado si quedó vacía
        carpetaEstado.setTrashed(true);
        console.log('   📁 Estado eliminado: ' + nombreEstado);
      } else {
        console.log('⚠️ No se encontró: ' + nombreEstado);
      }
    }
    
    console.log('✅ Eliminadas ' + eliminadas + ' carpetas');
    
  } catch (e) {
    console.log('❌ Error: ' + e.toString());
  }
  
  return eliminadas;
}