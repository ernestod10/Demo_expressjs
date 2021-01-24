const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres', //Aqui pongan su user
  host: 'localhost',
  database: 'Bases1', //el nombre de su BD
  password: '0809',           //y la contraseña
  port: 5432,
})
// SOCIOS proveedores
/* _____________________________________________________________________________________________________________*/
    //get todos los proveedores
    const getProveedores = (request, response) => {
      pool.query('SELECT * FROM edw_proveedores ',  (error, results) => {
      if (error) {
          throw error
      }
      response.status(200).json(results.rows)
      })
  }
  //GET todos los proovedores asociados a la agencia
  const getProveedoresAsociados = (request, response) => {
    const id = parseInt(request.params.id) //este id siempre pasalo como 1 ya que solo vamos a ver 1 agencia
    pool.query('SELECT * FROM edw_proveedores inner join edw_proovedor_agencia epa on edw_proveedores.numero_documento_1 = epa.edw_proveedores_numero_documento_1 where epa.edw_agencia_id_agencia = $1', [id], (error, results) => {
    if (error) {
        throw error
    }
    response.status(200).json(results.rows)
    })
  }
  //GET 1 proveedor
  const getProveedorId = (request, response) => {
      const id = parseInt(request.params.id)
    
      pool.query('SELECT * FROM edw_proveedores WHERE edw_proveedores.numero_documento_1 = $1', [id], (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).json(results.rows)
      })
    }
  //CREATE 1 Proveedor 
  const createProveedor = (request, response) => {
      const { numero_documento, nombre_proveedor, tipo_documento, telefono, tipo} = request.body
    
      pool.query('INSERT INTO edw_proveedores (numero_documento_1, nombre_proveedor ,tipo_documento ,telefono_proovedor ,tipo_proveedor) VALUES ($1, $2,$3,$4,$5)', [numero_documento, nombre_proveedor, tipo_documento, telefono, tipo], (error, results) => {
        if (error) {
          throw error
        }
        response.status(201).send(results.rows);
      })
    }
  //UPDATE cambia 1 proveedor por ID
  const updateProveedor = (request, response) => {
    const id = parseInt(request.params.id);
    const { numero_documento, nombre_proveedor, tipo_documento, telefono, tipo } = request.body
  
    pool.query('UPDATE edw_proveedores SET numero_documento_1 = $1, nombre_proveedor = $2,tipo_documento = $3,telefono =$4 ,tipo=$5 WHERE numero_documento_1 = $6',
      [numero_documento, nombre_proveedor, tipo_documento, telefono, tipo, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(results.rows)
      }
    )
  }
  //Asocia 1 proveedor con 1 agencia
  const asociarseProveedor = (request,response)=> {
    const id = parseInt(request.params.id);
    const {id_proveedor}= request.body
    pool.query('INSERT INTO edw_proovedor_agencia (edw_agencia_id_agencia, edw_proveedores_numero_documento_1, fecha_asociacion) VALUES ($1,$2,current_date)',
    [id, id_proveedor],
    (error,results)=>{
      if (error){
        throw error
      }
      response.status(200).send(results.rows)
    })
  }
  //Quita la Asociacion sin eliminar al proveedor
  const desasociarseProveedor = (request,response)=> {
    const id = parseInt(request.params.id);
    const {id_proveedor}= request.body
    pool.query('DELETE FROM EDW_proveedor_agencia WHERE edw_agencia_id_agencia = $1 AND edw_proveedores_numero_documento_1 = $2 ',
    [id, id_proveedor],
    (error,results)=>{
      if (error){
        throw error
      }
      response.status(200).send(results.rows)
    })
  }
  //ELIMINA 1 Proveedor con ID
  const elimProveedor = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query(' DELETE FROM edw_proveedores WHERE numero_documento_1 = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(results.rows)
    })
  }
// SOCIOS Agencias
/* _____________________________________________________________________________________________________________*/
  //GET todas las agencias
  const getAgencias = (request, response) => {
    pool.query('SELECT * FROM edw_agencia ',  (error, results) => {
    if (error) {
        throw error
    }
    response.status(200).json(results.rows)
    })
  }
  //GET todas las agencias Asociadas
  const getAgenciasSocias = (request, response) => {
    const id = parseInt(request.params.id)
    pool.query('SELECT * FROM edw_agencia inner join edw_socios es on edw_agencia.id_agencia = es.edw_agencia_id_agencia or edw_agencia.id_agencia = es.edw_agencia_id_agencia1 and es.edw_agencia_id_agencia = $1',[id],  (error, results) => {
    if (error) {
        throw error
    }
    response.status(200).json(results.rows)
    })
  }
  //GET Agencia por ID
  const getAgenciaId = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('select * from edw_agencia where edw_agencia_id_agencia = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  //CREATE agencia
  const createAgencia = (request, response) => {
    const { nombre_agencia, tipo_de_operacion, alcance, descripcion, pagina_web } = request.body
    
    pool.query('INSERT INTO edw_agencia ( nombre_agencia, tipo_de_operacion, alcance, descripcion, pagina_web) VALUES ($1,$2,$3,$4,$5)', [nombre_agencia, tipo_de_operacion, alcance, descripcion, pagina_web], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
    }
  //Asociarse A 1 Agencia
  const asociarseAgencia = (request, response) => {
    const id = parseInt(request.params.id)
    const { id_agencia_socia } = request.body
    
    pool.query('INSERT INTO edw_socios (fecha_asociacion, edw_agencia_id_agencia, edw_agencia_id_agencia2) VALUES (CURRENT_DATE,$1,$2)', [id,id_agencia_socia], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
    }
  //Desasociarse A 1 Agencia
  const desasociarseAgencia = (request, response) => {
  const id = parseInt(request.params.id)
  const { id_agencia_socia } = request.body

  pool.query('DELETE FROM edw_socios WHERE (edw_agencia_id_agencia =$1 and edw_agencia_id_agencia2 =$2) or(edw_agencia_id_agencia=$2 and edw_agencia_id_agencia2=$1) ', [id,id_agencia_socia], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
  }
  //UPDATE AGENCIA
  const updateAgencia = (request, response) => {
    const id = parseInt(request.params.id)
    const { nombre_agencia, tipo_de_operacion, alcance, descripcion, pagina_web } = request.body
    
    pool.query(
      'UPDATE edw_agencia set nombre_agencia=$1, tipo_de_operacion=$2,alcance=$3,descripcion =$4,pagina_web=$5',
      [nombre_agencia, tipo_de_operacion, alcance, descripcion, pagina_web],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(results.rows)
      }
    )
    }  
  //DELETE AGENCIA
  const elimAgencia = (request, response) => {
    const id = parseInt(request.params.id)
    
    pool.query('DELETE FROM edw_agencia where id_agencia = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(results.rows)
    })
    }

//REGISTRO CLIENTES
/* _____________________________________________________________________________________________________________*/
//GET todos los Clientes de esta agencia por ID
const getClientes= (request, response) => {
  const id_agencia = parseInt(request.params.id)
pool.query('select * from edw_cliente_registro inner join edw_cliente ec on ec.id_cliente = edw_cliente_registro.edw_cliente_id_cliente where edw_agencia_id_agencia=$1',[id_agencia], (error, results) => {
if (error) {
    throw error
}
response.status(200).json(results.rows)
})
}
//GET 1 Cliente por ID
const getClienteId = (request, response) => {
const id_cliente = parseInt(request.params.id)

pool.query('SELECT * from edw_cliente WHERE id_cliente = $1', [id_cliente], (error, results) => {
  if (error) {
    throw error
  }
  response.status(200).json(results.rows)
})
}
//GET 1 Cliente por numero de registro
const getRegClienteId = (request, response) => {
  const id_cliente = parseInt(request.params.id)
  
  pool.query('SELECT * FROM edw_cliente INNER JOIN edw_cliente_registro ecr ON edw_cliente.id_cliente = ecr.edw_cliente_id_cliente WHERE num_registro = $1', [id_cliente], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }
//CREATE 1 Cliente
const createCliente = (request, response) => {
const { nombre_cliente, tipo, apellido_1, apellido_2, edw_asesor_viaje_id_asesor } = request.body

pool.query('INSERT INTO edw_cliente (nombre_cliente, tipo, apellido_1, apellido_2, edw_asesor_viaje_id_asesor) VALUES ($1,$2,$3,$4,$5)', [nombre_cliente, tipo, apellido_1, apellido_2, edw_asesor_viaje_id_asesor], (error, results) => {
  if (error) {
    throw error
  }
  response.status(201).send(results.rows)
})
}
//Registrar Cliente
const registrarCliente = (request, response) => {
  const id_agencia = parseInt(request.params.id)
  const {id_cliente, asesor_id } = request.body //id asesor puede ser NULL
  
  pool.query('INSERT INTO edw_cliente_registro (fecha, edw_cliente_id_cliente, edw_cliente_asesor_id, edw_agencia_id_agencia) VALUES (CURRENT_DATE,$1,$2,$3)', [id_cliente, asesor_id, id_agencia], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
  }
//Quitar registro de cliente
const elimRegCliente = (request, response) => {
  const id_registro = parseInt(request.params.id)
  
  pool.query(' DELETE FROM edw_cliente_registro WHERE num_registro = $1', [id_registro], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
  }
//UPDATE cambia 1 Cliente por ID
const updateCliente = (request, response) => {
const id_cliente = parseInt(request.params.id)
const { nombre, tipo, apellido_1, apellido_2, asesor_id } = request.body

pool.query(
  'UPDATE edw_cliente set nombre_cliente=$1 ,tipo=$2 ,apellido_1=$3 ,apellido_2=$4 ,edw_asesor_viaje_id_asesor=$5 WHERE id_cliente = $6',
  [nombre, tipo, apellido_1, apellido_2, asesor_id, id_cliente],
  (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows)
  }
)
}
//ELIMINA 1 Cliente con ID
const elimCliente = (request, response) => {
const id_cliente = parseInt(request.params.id)

pool.query(' DELETE FROM edw_cliente WHERE id_cliente =$1', [id_cliente], (error, results) => {
  if (error) {
    throw error
  }
  response.status(200).send(results.rows)
})
}
//EXPEDIENTE VIAJEROS
/* _____________________________________________________________________________________________________________*/
//GET todos los Viajeros de esta agencia por ID
const getViajeros= (request, response) => {
  const id_agencia = parseInt(request.params.id)
pool.query('SELECT * FROM edw_viajero INNER JOIN edw_reg_viajero erv on edw_viajero.id_viajero = erv.edw_viajero_id_viajero WHERE ERV.edw_agencia_id_agencia = $1',[id_agencia], (error, results) => {
if (error) {
    throw error
}
response.status(200).json(results.rows)
})
}
//GET 1 Viajero por ID
const getViajerosId = (request, response) => {
const id_viajero = parseInt(request.params.id)

pool.query('SELECT * FROM edw_viajero WHERE id_viajero =$1', [id_viajero], (error, results) => {
  if (error) {
    throw error
  }
  response.status(200).json(results.rows)
})
}
//GET 1 Viajero por numero de registro
const getRegViajeroId = (request, response) => {
  const id_cliente = parseInt(request.params.id)
  
  pool.query('SELECT * FROM edw_viajero inner join edw_reg_viajero erv on edw_viajero.id_viajero = erv.edw_viajero_id_viajero WHERE erv.numunico = $1', [id_cliente], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
  }
//CREATE 1 Cliente
const createViajero = (request, response) => {
  const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, genero, id_ciudad, id_pais } = request.body //Ciudad y pais se seleccionan de una droplist, luego lo vemos

  pool.query('INSERT INTO edw_viajero (primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, genero, edw_ciudad_id_ciudad, edw_ciudad_edw_pais_id_pais) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)', 
  [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, genero, id_ciudad, id_pais], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
  }
//Registrar viajero
const registrarViajero = (request, response) => {
  const id_agencia = parseInt(request.params.id)
  const {id_viajero } = request.body
  
  pool.query('INSERT INTO edw_reg_viajero (fecha, edw_agencia_id_agencia, edw_viajero_id_viajero) VALUES (CURRENT_DATE,$1,$2)', [ id_agencia, id_viajero], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
  }
//Quitar registro de viajero
const elimRegViajero = (request, response) => {
  const id_registro = parseInt(request.params.id)
  
  pool.query(' DELETE FROM edw_reg_viajero WHERE  numunico=$1', [id_registro], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
  }
//UPDATE cambia 1 viajero por ID
const updateViajero = (request, response) => {
const id_viajero = parseInt(request.params.id)
const { primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, genero, id_ciudad, id_pais } = request.body

pool.query(
  'UPDATE edw_viajero set primer_nombre=$1, segundo_nombre=$2, primer_apellido=$3, segundo_apellido=$4, fecha_nacimiento=$5, genero=$6, edw_ciudad_id_ciudad=$7, edw_ciudad_edw_pais_id_pais=$8 WHERE id_viajero=$9',
  [primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, fecha_nacimiento, genero, id_ciudad, id_pais, id_viajero],
  (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows)
  }
)
}
//ELIMINA 1 viajero con ID
const elimViajero = (request, response) => {
const id_viajero = parseInt(request.params.id)

pool.query(' DELETE FROM edw_viajero WHERE id_viajero =$1', [id_viajero], (error, results) => {
  if (error) {
    throw error
  }
  response.status(200).send(results.rows)
})
}
//MANTENIMIENTO DE PAQUETES
/* _____________________________________________________________________________________________________________*/
//GET todos los paquetes de la agencia
const getPaquetes= (request, response) => {
  const id_agencia = parseInt(request.params.id)
  pool.query('select ep.*, ehpp.costo_base  from edw_paquete ep inner join edw_historico_precio_paquete ehpp on ep.id_paquete = ehpp.edw_paquete_id_paquete where ehpp.fecha_fin is NULL and ep.edw_agencia_id_agencia = $1',[id_agencia], (error, results) => {
  if (error) {
      throw error
  }
response.status(200).json(results.rows)
})
}
//GET 1 paquete por ID
const getPaqueteID= (request, response) => {
  const id = parseInt(request.params.id)
  pool.query('select ep.*, ehpp.costo_base  from edw_paquete ep inner join edw_historico_precio_paquete ehpp on ep.id_paquete = ehpp.edw_paquete_id_paquete where ehpp.fecha_fin is NULL and id_paquete = $1',[id], (error, results) => {
  if (error) {
      throw error
  }
response.status(200).json(results.rows)
})
}
//UPDATE cambia 1 paquete por ID
const updatePaquete = (request, response) => {
  const id_paquete = parseInt(request.params.id)
  const { nombre_paquete, duracion_paquete_dias, cantidad_personas, descripcion, edw_agencia_id_agencia, edw_ciudad_id_ciudad } = request.body
  
  pool.query(
    'update edw_paquete set  nombre_paquete = $1, duracion_paquete_dias=$2, cantidad_personas=$3, descripcion=$4 ,edw_agencia_id_agencia=$5 , edw_ciudad_id_ciudad=$6 where id_paquete =$7',
    [nombre_paquete, duracion_paquete_dias, cantidad_personas, descripcion, edw_agencia_id_agencia, edw_ciudad_id_ciudad,id_paquete],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(results.rows)
    }
  )
  }
//UPDATE PRECIO
  const updatePrePaquete = (request, response) => {
    const id_paquete = parseInt(request.params.id)
    const { Precio } = request.body
    
    pool.query(
      'with first_insert as (UPDATE edw_historico_precio_paquete set fecha_fin=current_date where edw_paquete_id_paquete = $1 and fecha_fin is null returning edw_paquete_id_paquete, edw_paquete_edw_agencia_id_agencia) insert into edw_historico_precio_paquete(fecha_inicio, costo_base, edw_paquete_id_paquete, edw_paquete_edw_agencia_id_agencia) values (current_date,$2,(select edw_paquete_id_paquete from first_insert ),(select first_insert.edw_paquete_edw_agencia_id_agencia from first_insert))',
      [id_paquete,Precio],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(results.rows)
      }
    )
    }
//GET todos las ciudades
const getCiudades= (request, response) => {
pool.query('select * from edw_ciudad', (error, results) => {
if (error) {
    throw error
}
response.status(200).json(results.rows)
})
}   
//GET todos las atracciones de las ciudades del paquete 
const getAtracciones= (request, response) => {
  const id_paquete = parseInt(request.params.id)
  pool.query('select id_atraccion, nombre_atraccion from edw_atraccion inner join edw_itinerario ei on edw_atraccion.edw_ciudad_id_ciudad = ei.edw_ciudad_id_ciudad where ei.edw_paquete_id_paquete = $1',[id_paquete], (error, results) => {
  if (error) {
      throw error
  }
  response.status(200).json(results.rows)
  })
  }  
//CREATE 1 paquete
const createPaquete = (request, response) => {
  const { nombre_paquete, duracion_paquete_dias, cantidad_personas, descripcion, id_ciudad, id_agencia  } = request.body //Ciudad y pais se seleccionan de una droplist, luego lo vemos

  pool.query('insert into edw_paquete (nombre_paquete, duracion_paquete_dias, cantidad_personas, descripcion, edw_ciudad_id_ciudad, edw_agencia_id_agencia, edw_ciudad_edw_pais_id_pais) values ($1,$2,$3,$4,$5,$6,(select edw_pais_id_pais from edw_ciudad where id_ciudad = $5)) returning  id_paquete', 
  [nombre_paquete, duracion_paquete_dias, cantidad_personas, descripcion, id_ciudad, id_agencia], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
  }
const agregarCalendario = (request, response) => {
  const { id_paquete, fecha_salida, descripcion, id_agencia  } = request.body //Ciudad y pais se seleccionan de una droplist, luego lo vemos

  pool.query('insert into edw_calendario_anual (fechas_salida, descripcion, edw_paquete_id_paquete, edw_paquete_edw_agencia_id_agencia) VALUES (1,2,3,4)', 
  [fecha_salida, id_paquete, descripcion, id_agencia ], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
}
const getCalendario = (request, response) => {
  const id_paquete = parseInt(request.params.id)
  
  pool.query('select * from edw_calendario_anual where edw_paquete_id_paquete = $1', [id_paquete], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows)
  })
  }

const elimCalendarioPaquete = (request, response) => {
  const id_paquete = parseInt(request.params.id)
  const {fecha_salida } = request.body
  pool.query('delete from edw_calendario_anual where edw_paquete_id_paquete=$1 and fechas_salida=$2 ', [id_paquete,fecha_salida], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows)
  })
  }
const agregarItinerarioPaquete = (request, response) => {
  const { orden, id_atraccion, id_paquete } = request.body //Ciudad y pais se seleccionan de una droplist, luego lo vemos
    pool.query('insert into edw_itinerario (edw_paquete_id_paquete, edw_ciudad_id_ciudad, orden, tiempo_estadia, edw_paquete_edw_agencia_id_agencia, edw_ciudad_edw_pais_id_pais) VALUES (1,2,3,4,5,(select edw_pais_id_pais from edw_ciudad where id_ciudad=2))', 
    [orden, id_atraccion, id_paquete], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
    }
const editarItinerarioPaquete = (request, response) => {
  const { orden, tiempo_estadia, id_paquete, id_ciudad } = request.body //Ciudad y pais se seleccionan de una droplist, luego lo vemos

  pool.query('update edw_itinerario set orden=$1, tiempo_estadia=$2 where edw_paquete_id_paquete=$3 and edw_ciudad_id_ciudad=$4', 
  [orden, tiempo_estadia, id_paquete,id_ciudad], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
  }
const elimItinerarioPaquete = (request, response) => {
    const id_paquete = parseInt(request.params.id)
    const {id_ciudad } = request.body
    pool.query('delete from edw_itinerario where edw_paquete_id_paquete = $1 and edw_ciudad_id_ciudad= $2', [id_paquete, id_ciudad], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(results.rows)
    })
    }
const agregarLugarPaquete = (request, response) => {
    const { orden, id_atraccion, id_paquete } = request.body //Ciudad y pais se seleccionan de una droplist, luego lo vemos
  
    pool.query('insert into edw_paquete_atraccion (orden_de_visita, edw_atraccion_id_atraccion, edw_paquete_id_paquete, edw_paquete_edw_agencia_id_agencia) values ($1,$2,$3,(select edw_agencia_id_agencia from edw_paquete where id_paquete=$3))', 
    [orden, id_atraccion, id_paquete], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(results.rows)
    })
    }
const editarLugarPaquete = (request, response) => {
  const { orden, id_atraccion, id_paquete } = request.body //Ciudad y pais se seleccionan de una droplist, luego lo vemos

  pool.query('update edw_paquete_atraccion set orden_de_visita=$1 where edw_atraccion_id_atraccion=$2 and edw_paquete_id_paquete=3', 
  [orden, id_atraccion, id_paquete], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(results.rows)
  })
  }
const elimLugarPaquete = (request, response) => {
    const id_paquete = parseInt(request.params.id)
    
    pool.query(' delete from edw_paquete where id_paquete = $1', [id_paquete], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(results.rows)
    })
    }
//ELIMINA 1 paquete con ID
const elimPaquete = (request, response) => {
  const id_paquete = parseInt(request.params.id)
  
  pool.query(' delete from edw_paquete where id_paquete = $1', [id_paquete], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(results.rows)
  })
  }


//COMPRA DE 1 PAQUETE
/* _____________________________________________________________________________________________________________*/



//RALLIES
/* _____________________________________________________________________________________________________________*/

module.exports={
  //SOCIOS
  //PROVEEDORES
  getProveedores,
  getProveedoresAsociados,
  getProveedorId,
  createProveedor,
  updateProveedor,
  elimProveedor,
  asociarseProveedor,
  desasociarseProveedor,
  //AGENCIAS
  getAgencias,
  getAgenciasSocias,
  getAgenciaId,
  createAgencia,
  updateAgencia,
  elimAgencia,
  asociarseAgencia,
  desasociarseAgencia,
  //CLIENTES
  getClientes,
  getClienteId,
  getRegClienteId,
  registrarCliente,
  elimRegCliente,
  createCliente,
  updateCliente,
  elimCliente,
  //VIAJEROS
  getViajeros,
  getViajerosId,
  getRegViajeroId,
  createViajero,
  registrarViajero,
  elimRegViajero,
  updateViajero,
  elimViajero
  //MANTENIMIENTO DE PAQUETES

  //VENTA DE PAQUETES

  //RALLIES 


}