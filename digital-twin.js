// ==========================
// CONFIGURACIÓN INICIAL
// ==========================

class CentroDistribucion {
  constructor(nombre, stock, stockSeguridad, costoTransporte) {
    this.nombre = nombre;
    this.stock = stock;
    this.stockSeguridad = stockSeguridad;
    this.costoTransporte = costoTransporte;
    this.pendienteReposicion = false;
  }
}

class CentroClasificacion {
  constructor(nombre, costoTransporte) {
    this.nombre = nombre;
    this.costoTransporte = costoTransporte;
  }
}

class EstacionEntrega {
  constructor(nombre, demanda, costoTransporte) {
    this.nombre = nombre;
    this.demanda = demanda;
    this.costoTransporte = costoTransporte;
  }
}

// ==========================
// DATOS INICIALES
// ==========================

const cds = [
  new CentroDistribucion("CD1", 1000, 250, 5),
  new CentroDistribucion("CD2", 1000, 350, 6),
  new CentroDistribucion("CD3", 1000, 250, 4),
  new CentroDistribucion("CD4", 1000, 250, 7),
  new CentroDistribucion("CD5", 1000, 315, 5),
];

const ccs = [
  new CentroClasificacion("CC1", 3),
  new CentroClasificacion("CC2", 4),
  new CentroClasificacion("CC3", 2),
];

const ees = [
  new EstacionEntrega("EE1", 50, 2),
  new EstacionEntrega("EE2", 60, 3),
  new EstacionEntrega("EE3", 40, 2),
  new EstacionEntrega("EE4", 70, 4),
  new EstacionEntrega("EE5", 55, 3),
];

// ==========================
// ESTADO GLOBAL
// ==========================

const estado = {
  hora: 0,
  costoTotal: 0,
};

// ==========================
// FUNCIONES AUXILIARES
// ==========================

function randomElemento(lista) {
  return lista[Math.floor(Math.random() * lista.length)];
}

// ==========================
// PROVEEDOR (REPOSICIÓN)
// ==========================

function pedirProveedor(cd) {
  if (cd.pendienteReposicion) return;

  cd.pendienteReposicion = true;

  console.log(`📦 Pedido al proveedor para ${cd.nombre}`);

  setTimeout(() => {
    cd.stock += 5000;
    cd.pendienteReposicion = false;

    console.log(`✅ Reposición completada en ${cd.nombre} (+5000 unidades)`);
  }, 24000); // 24 segundos = 24 horas
}

// ==========================
// SIMULACIÓN PRINCIPAL
// ==========================

function simulacion() {
  estado.hora++;

  console.log("\n==============================");
  console.log(`🕒 Hora: ${estado.hora}`);

  // 1. Seleccionar CD aleatorio
  const cd = randomElemento(cds);
  console.log(`📍 CD seleccionado: ${cd.nombre} (Stock: ${cd.stock})`);

  // 2. Validar stock
  if (cd.stock > cd.stockSeguridad) {

    const usarCC = Math.random() > 0.5;
    let eeDestino;
    let costoMovimiento = cd.costoTransporte;

    if (usarCC) {
      const cc = randomElemento(ccs);
      console.log(`➡️ Ruta: ${cd.nombre} → ${cc.nombre}`);

      costoMovimiento += cc.costoTransporte;

      eeDestino = randomElemento(ees);

      console.log(`➡️ Ruta final: ${cc.nombre} → ${eeDestino.nombre}`);

    } else {
      eeDestino = randomElemento(ees);
      console.log(`➡️ Ruta directa: ${cd.nombre} → ${eeDestino.nombre}`);
    }

    // 3. Generar cantidad (1-10)
    let cantidad = Math.floor(Math.random() * 10) + 1;

    // 4. Ajustar por restricciones
    cantidad = Math.min(cantidad, cd.stock, eeDestino.demanda);

    if (cantidad > 0) {
      // 5. Aplicar movimiento
      cd.stock -= cantidad;
      eeDestino.demanda -= cantidad;

      costoMovimiento += eeDestino.costoTransporte;
      estado.costoTotal += costoMovimiento;

      console.log(`📦 Enviado: ${cantidad} unidades a ${eeDestino.nombre}`);
      console.log(`💰 Costo movimiento: ${costoMovimiento}`);
    } else {
      console.log(`⚠️ No se pudo enviar (sin stock o sin demanda)`);
    }

  } else {
    console.log(`⚠️ ${cd.nombre} bajo stock (Stock: ${cd.stock})`);
    pedirProveedor(cd);
  }

  // ==========================
  // RESUMEN
  // ==========================

  console.log("\n📊 Estado CDs:");
  cds.forEach(cd => {
    console.log(`${cd.nombre}: Stock=${cd.stock}`);
  });

  console.log("\n📊 Estado EEs:");
  ees.forEach(ee => {
    console.log(`${ee.nombre}: Demanda=${ee.demanda}`);
  });

  console.log(`\n💰 Costo total acumulado: ${estado.costoTotal}`);
}

// ==========================
// INICIO SIMULACIÓN
// ==========================

console.log("🚀 Iniciando simulación de gemelo digital...\n");

setInterval(simulacion, 1000); // 1 segundo = 1 hora