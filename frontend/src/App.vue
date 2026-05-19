<template>
  <div class="app-shell bg-body-tertiary">
    <section v-if="!isAuthenticated" class="login-screen min-vh-100 d-flex align-items-center py-5">
      <div class="container">
        <div class="row justify-content-center align-items-stretch g-4">
          <div class="col-lg-5">
            <div class="card border-0 shadow-lg h-100 brand-panel text-white">
              <div class="card-body p-4 p-lg-5 d-flex flex-column justify-content-between">
                <div>
                  <img :src="logoUrl" class="logo-main bg-white rounded-4 p-3 mb-4" alt="Logo Impulso REP" />
                  <p class="text-uppercase small fw-semibold opacity-75 mb-2">Ingreso al sistema</p>
                  <h1 class="display-6 fw-bold mb-3">Impulso REP</h1>
                  <p class="lead mb-0">
                    Plataforma académica para registrar, validar y trazar declaraciones asociadas a la Ley REP, con perfiles de Productor, Gestor y Administrador.
                  </p>
                </div>
                <div class="mt-4 p-3 rounded-4 glass-box">
                  <strong>Enfoque del rediseño</strong>
                  <p class="mb-0 small opacity-75">
                    Interfaz migrada a Bootstrap 5, identidad visual actualizada y módulo legal incorporado para explicar la Ley 20.920 dentro de la misma aplicación.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="card border-0 shadow-lg h-100">
              <div class="card-body p-4 p-lg-5">
                <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
                  <div>
                    <p class="text-uppercase text-success small fw-semibold mb-1">Acceso demo</p>
                    <h2 class="h3 fw-bold mb-2">Entrar a Impulso REP</h2>
                    <p class="text-secondary mb-0">Usa un perfil de prueba para revisar los módulos implementados.</p>
                  </div>
                  <span class="badge rounded-pill bg-success-subtle text-success border border-success-subtle">Vue 3 + Bootstrap</span>
                </div>

                <form class="row g-3" @submit.prevent="login">
                  <div class="col-12">
                    <label class="form-label fw-semibold">Correo</label>
                    <input v-model="loginForm.email" class="form-control form-control-lg" type="email" placeholder="admin@impulsorep.cl" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-semibold">Contraseña</label>
                    <input v-model="loginForm.password" class="form-control form-control-lg" type="password" placeholder="admin123" required />
                  </div>
                  <div class="col-12 d-grid d-sm-flex gap-2">
                    <button class="btn btn-success btn-lg px-4" type="submit">Entrar al sistema</button>
                  </div>
                </form>

                <div class="row g-3 mt-4">
                  <div class="col-md-4" v-for="item in demoUsers" :key="item.email">
                    <article class="demo-card border rounded-4 p-3 h-100">
                      <strong class="d-block mb-1">{{ item.rol }}</strong>
                      <span class="small text-secondary d-block text-break">{{ item.email }}</span>
                      <code class="d-inline-block mt-2 mb-3 px-2 py-1 rounded bg-light">{{ item.password }}</code>
                      <button class="btn btn-outline-success btn-sm w-100" type="button" @click="useDemoUser(item)">Cargar perfil</button>
                    </article>
                  </div>
                </div>

                <div v-if="feedback.message" class="alert mt-4" :class="feedback.type === 'error' ? 'alert-danger' : 'alert-success'" role="alert">
                  {{ feedback.message }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div v-else class="container-fluid">
      <div class="row min-vh-100">
        <aside class="col-lg-3 col-xl-2 px-0 brand-sidebar text-white">
          <div class="position-sticky top-0 min-vh-100 p-4 d-flex flex-column gap-4">
            <div>
              <img :src="logoUrl" class="logo-sidebar bg-white rounded-4 p-2 mb-3" alt="Logo Impulso REP" />
              <p class="text-uppercase small fw-semibold opacity-75 mb-1">Proyecto de título</p>
              <h1 class="h3 fw-bold mb-3">Impulso REP</h1>
              <p class="small opacity-75 mb-0">
                Sistema web para gestionar declaraciones, validaciones, alertas y trazabilidad de residuos prioritarios bajo la Ley REP.
              </p>
            </div>

            <div class="p-3 rounded-4 glass-box">
              <strong class="d-block">Sesión activa</strong>
              <span class="d-block text-success-emphasis fw-semibold">{{ currentUser.nombre }}</span>
              <small class="d-block opacity-75 text-break">{{ currentUser.nombre_rol }} · {{ currentUser.email }}</small>
              <button class="btn btn-light btn-sm mt-3 w-100" type="button" @click="logout">Salir</button>
            </div>

            <nav class="nav nav-pills flex-column gap-2">
              <button
                v-for="view in availableViews"
                :key="view.id"
                class="nav-link text-start sidebar-link"
                :class="{ active: currentView === view.id }"
                type="button"
                @click="currentView = view.id"
              >
                <span class="fw-semibold d-block">{{ view.label }}</span>
                <small>{{ view.description }}</small>
              </button>
            </nav>

            <div class="p-3 rounded-4 glass-box mt-auto">
              <div class="d-flex justify-content-between align-items-center gap-3">
                <strong>Backend</strong>
                <span class="badge rounded-pill" :class="health.status === 'ok' ? 'text-bg-success' : 'text-bg-danger'">
                  {{ health.status === 'ok' ? 'Conectado' : 'Sin conexión' }}
                </span>
              </div>
              <small class="d-block opacity-75 text-break mt-2">{{ apiUrl }}</small>
            </div>
          </div>
        </aside>

        <main class="col-lg-9 col-xl-10 px-3 px-lg-4 py-4">
          <header class="card border-0 shadow-sm mb-4 hero-card">
            <div class="card-body p-4 p-lg-5">
              <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                <div>
                  <p class="text-uppercase text-success small fw-semibold mb-1">Vista activa</p>
                  <h2 class="fw-bold mb-2">{{ currentViewMeta.label }}</h2>
                  <p class="text-secondary mb-0 page-summary">{{ currentViewMeta.summary }}</p>
                </div>
                <div class="d-flex gap-2 flex-wrap">
                  <span class="badge rounded-pill text-bg-light border">{{ currentUser.nombre_rol }}</span>
                  <button class="btn btn-outline-success" type="button" @click="loadAll">Actualizar vista</button>
                </div>
              </div>
            </div>
          </header>

          <div v-if="feedback.message" class="alert" :class="feedback.type === 'error' ? 'alert-danger' : 'alert-success'" role="alert">
            {{ feedback.message }}
          </div>

          <section class="row g-3 mb-4">
            <div class="col-sm-6 col-xl-3">
              <article class="card border-0 shadow-sm metric-card h-100"><div class="card-body"><span>Usuarios activos</span><strong>{{ summary.usuarios }}</strong></div></article>
            </div>
            <div class="col-sm-6 col-xl-3">
              <article class="card border-0 shadow-sm metric-card h-100"><div class="card-body"><span>Declaraciones</span><strong>{{ summary.declaraciones }}</strong></div></article>
            </div>
            <div class="col-sm-6 col-xl-3">
              <article class="card border-0 shadow-sm metric-card h-100"><div class="card-body"><span>Pendientes</span><strong>{{ summary.pendientes }}</strong></div></article>
            </div>
            <div class="col-sm-6 col-xl-3">
              <article class="card border-0 shadow-sm metric-card h-100 warning"><div class="card-body"><span>Alertas abiertas</span><strong>{{ summary.alertas }}</strong></div></article>
            </div>
          </section>

          <section v-if="currentView === 'resumen'" class="section-stack">
            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <div class="row g-4 align-items-center">
                  <div class="col-lg-7">
                    <p class="text-uppercase text-success small fw-semibold mb-1">Resumen ejecutivo</p>
                    <h3 class="fw-bold">Arquitectura aplicada</h3>
                    <p class="text-secondary mb-0">
                      Para este proyecto implementé un frontend en Vue 3 + Vite, una interfaz basada en Bootstrap 5, un backend en Node.js + Express con API REST y persistencia en PostgreSQL desplegable en Render.
                    </p>
                  </div>
                  <div class="col-lg-5">
                    <div class="row g-3">
                      <div class="col-6"><div class="p-3 rounded-4 bg-success-subtle h-100"><strong>Vue 3</strong><small class="d-block text-secondary">SPA responsiva</small></div></div>
                      <div class="col-6"><div class="p-3 rounded-4 bg-success-subtle h-100"><strong>Express</strong><small class="d-block text-secondary">API REST</small></div></div>
                      <div class="col-6"><div class="p-3 rounded-4 bg-success-subtle h-100"><strong>PostgreSQL</strong><small class="d-block text-secondary">Modelo relacional</small></div></div>
                      <div class="col-6"><div class="p-3 rounded-4 bg-success-subtle h-100"><strong>Bootstrap</strong><small class="d-block text-secondary">Diseño renovado</small></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold mb-3">Qué resuelve Impulso REP</h3>
                <div class="row g-3">
                  <div class="col-md-6"><div class="p-3 border rounded-4 h-100"><h4 class="h6 fw-bold">Gestión operativa</h4><p class="text-secondary mb-0">Registro de declaraciones REP, estados, validación de período, reglas automáticas, alertas y auditoría de acciones relevantes.</p></div></div>
                  <div class="col-md-6"><div class="p-3 border rounded-4 h-100"><h4 class="h6 fw-bold">Cumplimiento y trazabilidad</h4><p class="text-secondary mb-0">La plataforma deja evidencia de quién registra, revisa, valida o rechaza una declaración, fortaleciendo el seguimiento del proceso.</p></div></div>
                </div>
              </div>
            </article>

            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                  <div>
                    <h3 class="fw-bold mb-1">Acceso rápido al proyecto</h3>
                    <p class="text-secondary mb-0">Enlaces editables para revisar despliegue y repositorio.</p>
                  </div>
                </div>
                <div class="row g-3">
                  <div class="col-md-6">
                    <a class="quick-link" href="https://impulsorep.onrender.com" target="_blank" rel="noreferrer">
                      <strong>Aplicación desplegada</strong>
                      <span>https://impulsorep.onrender.com</span>
                    </a>
                  </div>
                  <div class="col-md-6">
                    <a class="quick-link" href="https://github.com/Rolando-rivera/impulsorep" target="_blank" rel="noreferrer">
                      <strong>Repositorio público</strong>
                      <span>github.com/Rolando-rivera/impulsorep</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>

            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold mb-3">Últimos eventos de auditoría</h3>
                <div class="table-responsive rounded-4 border">
                  <table class="table table-hover align-middle mb-0" v-if="auditoria.length">
                    <thead class="table-light">
                      <tr><th>Fecha</th><th>Acción</th><th>Usuario</th><th>Detalle</th></tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in auditoria.slice(0, 8)" :key="item.id_evento">
                        <td>{{ formatDate(item.fecha_evento) }}</td>
                        <td>{{ item.accion }}</td>
                        <td>{{ item.usuario_nombre }}</td>
                        <td>{{ item.detalle }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="empty-state">No hay eventos de auditoría registrados.</div>
                </div>
              </div>
            </article>
          </section>

          <section v-if="currentView === 'ley'" class="section-stack">
            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <p class="text-uppercase text-success small fw-semibold mb-1">Marco normativo</p>
                <h3 class="fw-bold">Ley REP en la plataforma</h3>
                <p class="text-secondary mb-4">
                  Esta sección resume la Ley N° 20.920, sus actores, productos prioritarios, obligaciones y flujo de cumplimiento para que la aplicación no sea solo un CRUD, sino una herramienta alineada al proceso regulatorio.
                </p>
                <div class="row g-3">
                  <div class="col-md-6 col-xl-4" v-for="item in leyRepCards" :key="item.title">
                    <div class="legal-card border rounded-4 p-3 h-100">
                      <span class="badge rounded-pill bg-success-subtle text-success border border-success-subtle mb-2">{{ item.tag }}</span>
                      <h4 class="h6 fw-bold">{{ item.title }}</h4>
                      <p class="text-secondary mb-0">{{ item.text }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold mb-3">Productos prioritarios considerados</h3>
                <div class="row g-3">
                  <div class="col-sm-6 col-xl-3" v-for="item in productosPrioritarios" :key="item.nombre">
                    <div class="priority-card rounded-4 p-3 h-100">
                      <strong>{{ item.nombre }}</strong>
                      <small class="d-block text-secondary mt-2">{{ item.detalle }}</small>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold mb-3">Obligaciones que el sistema ayuda a controlar</h3>
                <div class="list-group list-group-flush border rounded-4 overflow-hidden">
                  <div class="list-group-item" v-for="item in obligacionesRep" :key="item.title">
                    <div class="d-flex gap-3">
                      <span class="step-dot flex-shrink-0">{{ item.step }}</span>
                      <div>
                        <strong>{{ item.title }}</strong>
                        <p class="text-secondary mb-0">{{ item.text }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold mb-3">Flujo operativo propuesto</h3>
                <div class="row g-3">
                  <div class="col-md-3" v-for="item in flujoLegalRep" :key="item.title">
                    <div class="flow-card border rounded-4 p-3 h-100">
                      <span class="badge text-bg-light border mb-2">{{ item.step }}</span>
                      <h4 class="h6 fw-bold">{{ item.title }}</h4>
                      <p class="text-secondary mb-0 small">{{ item.text }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </section>

          <section v-if="currentView === 'productor'" class="section-stack">
            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold">Registro de declaraciones REP</h3>
                <p class="text-secondary">El Productor registra productos prioritarios por período. Al guardar, el sistema recalcula validaciones y deja evidencia para seguimiento.</p>

                <form class="row g-3" @submit.prevent="saveDeclaracion">
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Productor</label>
                    <select v-model="declaracionForm.id_usuario" class="form-select" :disabled="isProductor" required>
                      <option value="">Elegir productor</option>
                      <option v-for="item in productorUsers" :key="item.id_usuario" :value="String(item.id_usuario)">{{ item.nombre }}</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Categoría REP</label>
                    <select v-model="declaracionForm.id_categoria" class="form-select" required>
                      <option value="">Elegir categoría</option>
                      <option v-for="item in categoriasActivas" :key="item.id_categoria" :value="String(item.id_categoria)">{{ item.nombre_categoria }}</option>
                    </select>
                  </div>
                  <div class="col-md-3">
                    <label class="form-label fw-semibold">Año</label>
                    <input v-model="declaracionForm.anio_periodo" class="form-control" type="number" min="2020" required />
                  </div>
                  <div class="col-md-3">
                    <label class="form-label fw-semibold">Mes</label>
                    <select v-model="declaracionForm.mes_periodo" class="form-select" required>
                      <option value="">Elegir mes</option>
                      <option v-for="mes in meses" :key="mes.value" :value="String(mes.value)">{{ mes.label }}</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label fw-semibold">Cantidad declarada (kg)</label>
                    <input v-model="declaracionForm.cantidad_kg" class="form-control" type="number" min="0" step="0.01" required />
                  </div>
                  <div class="col-12">
                    <label class="form-label fw-semibold">Observación</label>
                    <textarea v-model="declaracionForm.observacion" class="form-control" rows="3" placeholder="Agregar detalle si corresponde"></textarea>
                  </div>
                  <div class="col-12 d-flex flex-wrap gap-2">
                    <button class="btn btn-success" type="submit">{{ declaracionForm.id_declaracion ? 'Guardar cambios' : 'Registrar declaración' }}</button>
                    <button class="btn btn-outline-secondary" type="button" @click="resetDeclaracionForm">Limpiar formulario</button>
                  </div>
                </form>
              </div>
            </article>

            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <div class="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-3">
                  <div><h3 class="fw-bold mb-1">Declaraciones registradas</h3><p class="text-secondary mb-0">Listado principal con estado y acciones.</p></div>
                  <input class="form-control search-box" v-model="searchDeclaraciones" type="search" placeholder="Buscar por productor, categoría o estado" />
                </div>
                <div class="table-responsive rounded-4 border">
                  <table class="table table-hover align-middle mb-0" v-if="filteredDeclaraciones.length">
                    <thead class="table-light"><tr><th>ID</th><th>Productor</th><th>Categoría</th><th>Período</th><th>Cantidad</th><th>Estado</th><th>Acciones</th></tr></thead>
                    <tbody>
                      <tr v-for="item in filteredDeclaraciones" :key="item.id_declaracion">
                        <td>#{{ item.id_declaracion }}</td><td>{{ item.usuario_nombre }}</td><td>{{ item.nombre_categoria }}</td><td>{{ item.mes_periodo }}/{{ item.anio_periodo }}</td><td>{{ formatKg(item.cantidad_kg) }}</td>
                        <td><span class="badge" :class="badgeClass(item.nombre_estado)">{{ item.nombre_estado }}</span></td>
                        <td><div class="d-flex flex-wrap gap-2"><button class="btn btn-outline-success btn-sm" type="button" @click="editDeclaracion(item)">Editar</button><button class="btn btn-outline-danger btn-sm" type="button" @click="deleteDeclaracion(item.id_declaracion)">Eliminar</button></div></td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="empty-state">Todavía no hay declaraciones registradas.</div>
                </div>
              </div>
            </article>
          </section>

          <section v-if="currentView === 'gestor'" class="section-stack">
            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold">Validación operativa</h3>
                <p class="text-secondary">El Gestor revisa reglas automáticas y aprueba o rechaza declaraciones.</p>
                <div class="table-responsive rounded-4 border">
                  <table class="table table-hover align-middle mb-0" v-if="declaraciones.length">
                    <thead class="table-light"><tr><th>ID</th><th>Productor</th><th>Categoría</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
                    <tbody>
                      <tr v-for="item in declaraciones" :key="item.id_declaracion">
                        <td>#{{ item.id_declaracion }}</td><td>{{ item.usuario_nombre }}</td><td>{{ item.nombre_categoria }}</td><td><span class="badge" :class="badgeClass(item.nombre_estado)">{{ item.nombre_estado }}</span></td><td>{{ formatDate(item.fecha_declaracion) }}</td>
                        <td><div class="d-flex flex-wrap gap-2"><button class="btn btn-success btn-sm" type="button" @click="changeEstado(item.id_declaracion, 'validar')">Aprobar</button><button class="btn btn-danger btn-sm" type="button" @click="changeEstado(item.id_declaracion, 'rechazar')">Rechazar</button></div></td>
                      </tr>
                    </tbody>
                  </table>
                  <div v-else class="empty-state">No hay declaraciones para revisar.</div>
                </div>
              </div>
            </article>

            <div class="row g-4">
              <div class="col-xl-6">
                <article class="card border-0 shadow-sm h-100">
                  <div class="card-body p-4">
                    <h3 class="fw-bold">Validaciones automáticas</h3>
                    <p class="text-secondary">Resultado de reglas sobre cada declaración.</p>
                    <div class="table-responsive rounded-4 border">
                      <table class="table table-hover align-middle mb-0" v-if="validaciones.length">
                        <thead class="table-light"><tr><th>Declaración</th><th>Regla</th><th>Resultado</th></tr></thead>
                        <tbody><tr v-for="item in validaciones.slice(0, 10)" :key="item.id_validacion"><td>#{{ item.id_declaracion }}</td><td>{{ item.codigo_regla }} - {{ item.nombre_regla }}</td><td><span class="badge" :class="badgeValidation(item.resultado)">{{ item.resultado }}</span></td></tr></tbody>
                      </table>
                      <div v-else class="empty-state">No hay validaciones registradas.</div>
                    </div>
                  </div>
                </article>
              </div>
              <div class="col-xl-6">
                <article class="card border-0 shadow-sm h-100">
                  <div class="card-body p-4">
                    <h3 class="fw-bold">Alertas preventivas</h3>
                    <p class="text-secondary">Alertas generadas por reglas que requieren seguimiento.</p>
                    <div class="table-responsive rounded-4 border">
                      <table class="table table-hover align-middle mb-0" v-if="alertas.length">
                        <thead class="table-light"><tr><th>Nivel</th><th>Mensaje</th><th>Acción</th></tr></thead>
                        <tbody>
                          <tr v-for="item in alertas.slice(0, 10)" :key="item.id_alerta"><td><span class="badge" :class="alertBadge(item.nivel_alerta)">{{ item.nivel_alerta }}</span></td><td>{{ item.mensaje }}</td><td><button class="btn btn-outline-success btn-sm" type="button" @click="markAlerta(item.id_alerta, true)">{{ item.atendida ? 'Atendida' : 'Marcar como revisada' }}</button></td></tr>
                        </tbody>
                      </table>
                      <div v-else class="empty-state">No hay alertas abiertas.</div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>

          <section v-if="currentView === 'admin'" class="section-stack">
            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold">Mantenimiento de categorías REP</h3>
                <p class="text-secondary">Catálogo principal de productos prioritarios y categorías usadas en las declaraciones.</p>
                <form class="row g-3" @submit.prevent="saveCategoria">
                  <div class="col-md-5"><label class="form-label fw-semibold">Nombre categoría</label><input v-model="categoriaForm.nombre_categoria" class="form-control" type="text" required /></div>
                  <div class="col-md-2"><label class="form-label fw-semibold">Activa</label><div class="form-check form-switch pt-2"><input v-model="categoriaForm.activo" class="form-check-input" type="checkbox" /></div></div>
                  <div class="col-12"><label class="form-label fw-semibold">Descripción</label><textarea v-model="categoriaForm.descripcion" class="form-control" rows="3"></textarea></div>
                  <div class="col-12 d-flex flex-wrap gap-2"><button class="btn btn-success" type="submit">{{ categoriaForm.id_categoria ? 'Guardar cambios' : 'Crear categoría REP' }}</button><button class="btn btn-outline-secondary" type="button" @click="resetCategoriaForm">Limpiar formulario</button></div>
                </form>
                <div class="table-responsive rounded-4 border mt-4">
                  <table class="table table-hover align-middle mb-0" v-if="categorias.length">
                    <thead class="table-light"><tr><th>ID</th><th>Nombre</th><th>Activa</th><th>Acciones</th></tr></thead>
                    <tbody><tr v-for="item in categorias" :key="item.id_categoria"><td>#{{ item.id_categoria }}</td><td>{{ item.nombre_categoria }}</td><td>{{ item.activo ? 'Sí' : 'No' }}</td><td><div class="d-flex flex-wrap gap-2"><button class="btn btn-outline-success btn-sm" type="button" @click="editCategoria(item)">Editar</button><button class="btn btn-outline-danger btn-sm" type="button" @click="deleteCategoria(item.id_categoria)">Eliminar</button></div></td></tr></tbody>
                  </table>
                </div>
              </div>
            </article>

            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold">Mantenimiento de metas anuales</h3>
                <p class="text-secondary">Parámetros de cumplimiento definidos por categoría y año.</p>
                <form class="row g-3" @submit.prevent="saveMeta">
                  <div class="col-md-5"><label class="form-label fw-semibold">Categoría</label><select v-model="metaForm.id_categoria" class="form-select" required><option value="">Seleccione</option><option v-for="item in categoriasActivas" :key="item.id_categoria" :value="String(item.id_categoria)">{{ item.nombre_categoria }}</option></select></div>
                  <div class="col-md-3"><label class="form-label fw-semibold">Año</label><input v-model="metaForm.anio" class="form-control" type="number" min="2020" required /></div>
                  <div class="col-md-4"><label class="form-label fw-semibold">% Meta</label><input v-model="metaForm.porcentaje_meta" class="form-control" type="number" min="0" max="100" step="0.01" required /></div>
                  <div class="col-12 d-flex flex-wrap gap-2"><button class="btn btn-success" type="submit">{{ metaForm.id_meta ? 'Guardar cambios' : 'Crear meta anual' }}</button><button class="btn btn-outline-secondary" type="button" @click="resetMetaForm">Limpiar formulario</button></div>
                </form>
                <div class="table-responsive rounded-4 border mt-4">
                  <table class="table table-hover align-middle mb-0" v-if="metas.length">
                    <thead class="table-light"><tr><th>ID</th><th>Categoría</th><th>Año</th><th>%</th><th>Acciones</th></tr></thead>
                    <tbody><tr v-for="item in metas" :key="item.id_meta"><td>#{{ item.id_meta }}</td><td>{{ item.nombre_categoria }}</td><td>{{ item.anio }}</td><td>{{ item.porcentaje_meta }}%</td><td><div class="d-flex flex-wrap gap-2"><button class="btn btn-outline-success btn-sm" type="button" @click="editMeta(item)">Editar</button><button class="btn btn-outline-danger btn-sm" type="button" @click="deleteMeta(item.id_meta)">Eliminar</button></div></td></tr></tbody>
                  </table>
                </div>
              </div>
            </article>

            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold">Mantenimiento de reglas de validación</h3>
                <p class="text-secondary">Reglas parametrizables usadas por el motor de validaciones.</p>
                <form class="row g-3" @submit.prevent="saveRegla">
                  <div class="col-md-3"><label class="form-label fw-semibold">Código</label><input v-model="reglaForm.codigo_regla" class="form-control" type="text" required /></div>
                  <div class="col-md-5"><label class="form-label fw-semibold">Nombre regla</label><input v-model="reglaForm.nombre_regla" class="form-control" type="text" required /></div>
                  <div class="col-md-2"><label class="form-label fw-semibold">Valor mínimo</label><input v-model="reglaForm.valor_min" class="form-control" type="number" step="0.01" /></div>
                  <div class="col-md-2"><label class="form-label fw-semibold">Valor máximo</label><input v-model="reglaForm.valor_max" class="form-control" type="number" step="0.01" /></div>
                  <div class="col-md-2"><label class="form-label fw-semibold">Activa</label><div class="form-check form-switch pt-2"><input v-model="reglaForm.activo" class="form-check-input" type="checkbox" /></div></div>
                  <div class="col-12"><label class="form-label fw-semibold">Descripción</label><textarea v-model="reglaForm.descripcion" class="form-control" rows="3" required></textarea></div>
                  <div class="col-12 d-flex flex-wrap gap-2"><button class="btn btn-success" type="submit">{{ reglaForm.id_regla ? 'Guardar cambios' : 'Crear regla' }}</button><button class="btn btn-outline-secondary" type="button" @click="resetReglaForm">Limpiar formulario</button></div>
                </form>
                <div class="table-responsive rounded-4 border mt-4">
                  <table class="table table-hover align-middle mb-0" v-if="reglas.length">
                    <thead class="table-light"><tr><th>Código</th><th>Nombre</th><th>Activa</th><th>Acciones</th></tr></thead>
                    <tbody><tr v-for="item in reglas" :key="item.id_regla"><td>{{ item.codigo_regla }}</td><td>{{ item.nombre_regla }}</td><td>{{ item.activo ? 'Sí' : 'No' }}</td><td><div class="d-flex flex-wrap gap-2"><button class="btn btn-outline-success btn-sm" type="button" @click="editRegla(item)">Editar</button><button class="btn btn-outline-danger btn-sm" type="button" @click="deleteRegla(item.id_regla)">Eliminar</button></div></td></tr></tbody>
                  </table>
                </div>
              </div>
            </article>

            <article class="card border-0 shadow-sm">
              <div class="card-body p-4">
                <h3 class="fw-bold">Cuentas y perfiles de usuario</h3>
                <p class="text-secondary">Administración funcional de perfiles de acceso.</p>
                <form class="row g-3" @submit.prevent="saveUsuario">
                  <div class="col-md-4"><label class="form-label fw-semibold">Nombre</label><input v-model="usuarioForm.nombre" class="form-control" type="text" required /></div>
                  <div class="col-md-4"><label class="form-label fw-semibold">Correo</label><input v-model="usuarioForm.email" class="form-control" type="email" required /></div>
                  <div class="col-md-4"><label class="form-label fw-semibold">Rol</label><select v-model="usuarioForm.id_rol" class="form-select" required><option value="">Seleccione</option><option v-for="item in roles" :key="item.id_rol" :value="String(item.id_rol)">{{ item.nombre_rol }}</option></select></div>
                  <div class="col-md-6"><label class="form-label fw-semibold">Contraseña {{ usuarioForm.id_usuario ? '(déjala vacía si no la cambiarás)' : '' }}</label><input v-model="usuarioForm.password" class="form-control" type="text" placeholder="demo123" /></div>
                  <div class="col-md-2"><label class="form-label fw-semibold">Activo</label><div class="form-check form-switch pt-2"><input v-model="usuarioForm.activo" class="form-check-input" type="checkbox" /></div></div>
                  <div class="col-12 d-flex flex-wrap gap-2"><button class="btn btn-success" type="submit">{{ usuarioForm.id_usuario ? 'Guardar cambios' : 'Crear usuario' }}</button><button class="btn btn-outline-secondary" type="button" @click="resetUsuarioForm">Limpiar formulario</button></div>
                </form>
                <div class="table-responsive rounded-4 border mt-4">
                  <table class="table table-hover align-middle mb-0" v-if="usuarios.length">
                    <thead class="table-light"><tr><th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th></tr></thead>
                    <tbody><tr v-for="item in usuarios" :key="item.id_usuario"><td>#{{ item.id_usuario }}</td><td>{{ item.nombre }}</td><td>{{ item.email }}</td><td>{{ item.nombre_rol }}</td><td><div class="d-flex flex-wrap gap-2"><button class="btn btn-outline-success btn-sm" type="button" @click="editUsuario(item)">Editar</button><button class="btn btn-outline-danger btn-sm" type="button" @click="deleteUsuario(item.id_usuario)">Eliminar</button></div></td></tr></tbody>
                  </table>
                </div>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>


<script>
import logoUrl from './assets/logo-impulso-rep.jpeg';

export default {
  data() {
    return {
      apiUrl: import.meta.env.VITE_API_URL || window.location.origin,
      logoUrl,
      isAuthenticated: false,
      currentUser: null,
      loginForm: { email: 'admin@impulsorep.cl', password: 'admin123' },
      demoUsers: [
        { rol: 'Administrador', email: 'admin@impulsorep.cl', password: 'admin123' },
        { rol: 'Gestor', email: 'gestor@impulsorep.cl', password: 'gestor123' },
        { rol: 'Productor', email: 'productor@impulsorep.cl', password: 'productor123' },
      ],
      health: { status: 'unknown' },
      currentView: 'resumen',
      views: [
        {
          id: 'resumen',
          label: 'Resumen general',
          description: 'Resumen, enlaces y guía de revisión.',
          summary: 'Panel principal con indicadores, enlaces del proyecto, una guía rápida de revisión y los últimos eventos relevantes del sistema.',
        },
        {
          id: 'ley',
          label: 'Marco Ley REP',
          description: 'Ley 20.920, actores y obligaciones.',
          summary: 'Módulo informativo que resume la Ley 20.920, productos prioritarios, obligaciones del productor, sistemas de gestión y trazabilidad regulatoria.',
        },
        {
          id: 'productor',
          label: 'Perfil productor',
          description: 'CRUD de declaraciones REP.',
          summary: 'Módulo que dejé preparado para registrar, editar y eliminar declaraciones REP asociadas a productores y categorías del sistema.',
        },
        {
          id: 'gestor',
          label: 'Perfil gestor',
          description: 'Validación, alertas y seguimiento.',
          summary: 'Panel operativo para revisar resultados de validación, atender alertas y aprobar o rechazar declaraciones dentro del flujo definido para el proyecto.',
        },
        {
          id: 'admin',
          label: 'Perfil administrador',
          description: 'Catálogos, metas, reglas y usuarios.',
          summary: 'Sección de mantenimiento del dominio con formularios CRUD para categorías REP, metas anuales, reglas de validación y cuentas, pensada para la administración general del sistema.',
        },
      ],
      leyRepCards: [
        {
          tag: 'Objeto',
          title: 'Disminuir residuos y fomentar valorización',
          text: 'La Ley 20.920 busca reducir la generación de residuos y promover reutilización, reciclaje y otras formas de valorización para proteger la salud de las personas y el medio ambiente.',
        },
        {
          tag: 'REP',
          title: 'Responsabilidad Extendida del Productor',
          text: 'El productor debe organizar y financiar la gestión de los residuos derivados de los productos prioritarios que comercializa en el país.',
        },
        {
          tag: 'Trazabilidad',
          title: 'Seguimiento del residuo',
          text: 'La gestión debe permitir conocer cantidades, ubicación y trayectoria del residuo o lote de residuos durante la cadena de manejo.',
        },
        {
          tag: 'Gestión',
          title: 'Sistemas de gestión',
          text: 'Los productores pueden cumplir sus obligaciones de forma individual o colectiva mediante sistemas de gestión autorizados y planes de gestión.',
        },
        {
          tag: 'Control',
          title: 'Fiscalización y sanciones',
          text: 'La Superintendencia del Medio Ambiente fiscaliza el cumplimiento de metas y obligaciones, pudiendo aplicar sanciones cuando corresponda.',
        },
        {
          tag: 'RETC',
          title: 'Información y declaraciones',
          text: 'La información anual y reportes de cumplimiento se canalizan mediante plataformas oficiales como el Registro de Emisiones y Transferencia de Contaminantes.',
        },
      ],
      productosPrioritarios: [
        { nombre: 'Aceites lubricantes', detalle: 'Producto prioritario regulado por la Ley 20.920.' },
        { nombre: 'Aparatos eléctricos y electrónicos', detalle: 'Incluye equipos que generan residuos eléctricos o electrónicos.' },
        { nombre: 'Baterías', detalle: 'Producto prioritario con obligaciones de declaración y gestión.' },
        { nombre: 'Envases y embalajes', detalle: 'Categoría relevante para productores que introducen bienes envasados al mercado.' },
        { nombre: 'Neumáticos', detalle: 'Producto prioritario con metas y obligaciones asociadas según decreto específico.' },
        { nombre: 'Pilas', detalle: 'Producto prioritario sujeto a obligaciones de información y gestión.' },
        { nombre: 'Textiles', detalle: 'Incorporado como producto prioritario en el marco actualizado informado por MMA.' },
        { nombre: 'Diarios, periódicos y revistas', detalle: 'Régimen especial de declaración, sin metas de valorización asociadas.' },
      ],
      obligacionesRep: [
        { step: '1', title: 'Registrarse e informar', text: 'El productor debe entregar información sobre productos comercializados, residuos recolectados, valorizados o eliminados y costos de gestión cuando sea requerido.' },
        { step: '2', title: 'Organizar y financiar la gestión', text: 'La REP exige asumir la organización y financiamiento de la gestión de residuos derivados de productos prioritarios.' },
        { step: '3', title: 'Cumplir metas y obligaciones', text: 'Las metas de recolección y valorización se establecen mediante decretos supremos por producto prioritario.' },
        { step: '4', title: 'Usar gestores autorizados', text: 'La gestión de residuos debe realizarse mediante gestores autorizados y registrados.' },
        { step: '5', title: 'Mantener evidencia y trazabilidad', text: 'Las acciones del sistema deben dejar registro auditable para demostrar seguimiento y control del proceso.' },
      ],
      flujoLegalRep: [
        { step: '01', title: 'Productor declara', text: 'Ingresa producto prioritario, período, cantidad y observaciones.' },
        { step: '02', title: 'Sistema valida', text: 'Aplica reglas automáticas de cantidad, meta anual y período único.' },
        { step: '03', title: 'Gestor revisa', text: 'Evalúa alertas, valida o rechaza la declaración según antecedentes.' },
        { step: '04', title: 'Auditoría registra', text: 'Guarda eventos, estados y trazabilidad para seguimiento posterior.' },
      ],

      meses: [
        { value: 1, label: 'Enero' },
        { value: 2, label: 'Febrero' },
        { value: 3, label: 'Marzo' },
        { value: 4, label: 'Abril' },
        { value: 5, label: 'Mayo' },
        { value: 6, label: 'Junio' },
        { value: 7, label: 'Julio' },
        { value: 8, label: 'Agosto' },
        { value: 9, label: 'Septiembre' },
        { value: 10, label: 'Octubre' },
        { value: 11, label: 'Noviembre' },
        { value: 12, label: 'Diciembre' },
      ],
      feedback: { message: '', type: 'success' },
      summary: {
        usuarios: 0,
        declaraciones: 0,
        pendientes: 0,
        alertas: 0,
        categorias: 0,
        reglas: 0,
      },
      roles: [],
      estados: [],
      categorias: [],
      metas: [],
      reglas: [],
      usuarios: [],
      declaraciones: [],
      validaciones: [],
      alertas: [],
      auditoria: [],
      searchDeclaraciones: '',
      declaracionForm: null,
      categoriaForm: null,
      metaForm: null,
      reglaForm: null,
      usuarioForm: null,
    };
  },
  computed: {
    isAdmin() {
      return this.currentUser?.nombre_rol === 'Administrador';
    },
    isGestor() {
      return this.currentUser?.nombre_rol === 'Gestor';
    },
    isProductor() {
      return this.currentUser?.nombre_rol === 'Productor';
    },
    availableViews() {
      const map = {
        Administrador: ['resumen', 'ley', 'productor', 'gestor', 'admin'],
        Gestor: ['resumen', 'ley', 'gestor'],
        Productor: ['resumen', 'ley', 'productor'],
      };
      const allowed = this.currentUser ? map[this.currentUser.nombre_rol] || ['resumen'] : [];
      return this.views.filter((item) => allowed.includes(item.id));
    },
    currentViewMeta() {
      return this.availableViews.find((item) => item.id === this.currentView) || this.availableViews[0] || this.views[0];
    },
    categoriasActivas() {
      return this.categorias.filter((item) => item.activo);
    },
    productorUsers() {
      const users = this.usuarios.filter((item) => item.nombre_rol === 'Productor' && item.activo);
      return this.isProductor ? users.filter((item) => item.id_usuario === this.currentUser.id_usuario) : users;
    },
    filteredDeclaraciones() {
      const base = this.isProductor
        ? this.declaraciones.filter((item) => item.id_usuario === this.currentUser.id_usuario)
        : this.declaraciones;
      const term = this.searchDeclaraciones.trim().toLowerCase();
      if (!term) return base;
      return base.filter((item) =>
        [
          item.usuario_nombre,
          item.nombre_categoria,
          item.nombre_estado,
          String(item.id_declaracion),
          String(item.anio_periodo),
          String(item.mes_periodo),
        ]
          .join(' ')
          .toLowerCase()
          .includes(term),
      );
    },
  },
  methods: {
    newDeclaracionForm() {
      return {
        id_declaracion: null,
        id_usuario: this.isProductor ? String(this.currentUser.id_usuario) : '',
        id_categoria: '',
        anio_periodo: new Date().getFullYear(),
        mes_periodo: '',
        cantidad_kg: '',
        observacion: '',
      };
    },
    newCategoriaForm() {
      return {
        id_categoria: null,
        nombre_categoria: '',
        descripcion: '',
        activo: true,
      };
    },
    newMetaForm() {
      return {
        id_meta: null,
        id_categoria: '',
        anio: new Date().getFullYear(),
        porcentaje_meta: '',
      };
    },
    newReglaForm() {
      return {
        id_regla: null,
        codigo_regla: '',
        nombre_regla: '',
        descripcion: '',
        valor_min: '',
        valor_max: '',
        activo: true,
      };
    },
    newUsuarioForm() {
      return {
        id_usuario: null,
        nombre: '',
        email: '',
        id_rol: '',
        password: '',
        activo: true,
      };
    },
    roleHomeView() {
      if (this.isAdmin) return 'admin';
      if (this.isGestor) return 'gestor';
      if (this.isProductor) return 'productor';
      return 'resumen';
    },
    ensureCurrentView() {
      if (!this.availableViews.some((item) => item.id === this.currentView)) {
        this.currentView = this.roleHomeView();
      }
    },
    persistSession() {
      if (this.currentUser) {
        localStorage.setItem('impulsorep_session', JSON.stringify(this.currentUser));
      }
    },
    restoreSession() {
      try {
        const raw = localStorage.getItem('impulsorep_session');
        if (!raw) return false;
        this.currentUser = JSON.parse(raw);
        this.isAuthenticated = true;
        this.currentView = this.roleHomeView();
        return true;
      } catch (error) {
        localStorage.removeItem('impulsorep_session');
        return false;
      }
    },
    async login() {
      try {
        const response = await this.api('/api/login', {
          method: 'POST',
          body: JSON.stringify(this.loginForm),
        });
        this.currentUser = response.user;
        this.isAuthenticated = true;
        this.currentView = this.roleHomeView();
        this.persistSession();
        this.resetDeclaracionForm();
        await this.checkHealth();
        await this.loadAll();
        this.notify(`Sesión iniciada correctamente. Bienvenido, ${this.currentUser.nombre}.`);
      } catch (error) {
        this.notify(error.message || 'No pude iniciar la sesión con esos datos.', 'error');
      }
    },
    useDemoUser(item) {
      this.loginForm = { email: item.email, password: item.password };
    },
    logout() {
      this.isAuthenticated = false;
      this.currentUser = null;
      this.currentView = 'resumen';
      this.summary = { usuarios: 0, declaraciones: 0, pendientes: 0, alertas: 0, categorias: 0, reglas: 0 };
      this.roles = [];
      this.estados = [];
      this.categorias = [];
      this.metas = [];
      this.reglas = [];
      this.usuarios = [];
      this.declaraciones = [];
      this.validaciones = [];
      this.alertas = [];
      this.auditoria = [];
      this.searchDeclaraciones = '';
      localStorage.removeItem('impulsorep_session');
      this.loginForm = { email: 'admin@impulsorep.cl', password: 'admin123' };
      this.resetDeclaracionForm();
      this.resetCategoriaForm();
      this.resetMetaForm();
      this.resetReglaForm();
      this.resetUsuarioForm();
      this.notify('La sesión se cerró correctamente.');
    },
    notify(message, type = 'success') {
      this.feedback = { message, type };
      window.clearTimeout(this.feedbackTimer);
      this.feedbackTimer = window.setTimeout(() => {
        this.feedback.message = '';
      }, 5000);
    },
    async api(path, options = {}) {
      const headers = new Headers(options.headers || {});
      if (options.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
      const response = await fetch(`${this.apiUrl}${path}`, { ...options, headers });
      if (!response.ok) {
        let message = `Error ${response.status}`;
        try {
          const data = await response.json();
          message = data.error || message;
        } catch (error) {
          const text = await response.text();
          if (text) message = text;
        }
        throw new Error(message);
      }
      if (response.status === 204) return null;
      return response.json();
    },
    badgeClass(estado) {
      const normalized = String(estado || '').toLowerCase();
      if (normalized.includes('valid')) return 'validated';
      if (normalized.includes('rech')) return 'rejected';
      return 'pending';
    },
    badgeValidation(resultado) {
      const normalized = String(resultado || '').toLowerCase();
      if (normalized.includes('cumple')) return 'validated';
      if (normalized.includes('no cumple')) return 'rejected';
      return 'warning';
    },
    alertBadge(nivel) {
      const normalized = String(nivel || '').toLowerCase();
      if (normalized.includes('alta')) return 'rejected';
      if (normalized.includes('media')) return 'pending';
      return 'validated';
    },
    formatKg(value) {
      return `${Number(value || 0).toLocaleString('es-CL', { maximumFractionDigits: 2 })} kg`;
    },
    formatDate(value) {
      if (!value) return '-';
      return new Date(value).toLocaleString('es-CL');
    },
    async checkHealth() {
      try {
        this.health = await this.api('/api/health');
      } catch (error) {
        this.health = { status: 'error' };
      }
    },
    async loadAll() {
      if (!this.isAuthenticated) return;
      try {
        const [catalogos, summary, usuarios, categorias, metas, reglas, declaraciones, validaciones, alertas, auditoria] = await Promise.all([
          this.api('/api/catalogos'),
          this.api('/api/resumen'),
          this.api('/api/usuarios'),
          this.api('/api/categorias'),
          this.api('/api/metas'),
          this.api('/api/reglas'),
          this.api('/api/declaraciones'),
          this.api('/api/validaciones'),
          this.api('/api/alertas'),
          this.api('/api/auditoria'),
        ]);

        this.roles = catalogos.roles;
        this.estados = catalogos.estados;
        this.summary = summary;
        this.usuarios = usuarios;
        this.categorias = categorias;
        this.metas = metas;
        this.reglas = reglas;
        this.declaraciones = declaraciones;
        this.validaciones = validaciones;
        this.alertas = alertas;
        this.auditoria = auditoria;
        this.ensureCurrentView();
      } catch (error) {
        this.notify(error.message || 'No pude cargar los datos del sistema.', 'error');
      }
    },
    resetDeclaracionForm() {
      this.declaracionForm = this.newDeclaracionForm();
    },
    resetCategoriaForm() {
      this.categoriaForm = this.newCategoriaForm();
    },
    resetMetaForm() {
      this.metaForm = this.newMetaForm();
    },
    resetReglaForm() {
      this.reglaForm = this.newReglaForm();
    },
    resetUsuarioForm() {
      this.usuarioForm = this.newUsuarioForm();
    },
    editDeclaracion(item) {
      this.declaracionForm = {
        id_declaracion: item.id_declaracion,
        id_usuario: String(item.id_usuario),
        id_categoria: String(item.id_categoria),
        anio_periodo: item.anio_periodo,
        mes_periodo: String(item.mes_periodo),
        cantidad_kg: item.cantidad_kg,
        observacion: item.observacion || '',
      };
      this.currentView = 'productor';
      this.notify(`Cargué la declaración #${item.id_declaracion} para editarla.`);
    },
    async saveDeclaracion() {
      try {
        const payload = {
          id_usuario: this.isProductor ? Number(this.currentUser.id_usuario) : Number(this.declaracionForm.id_usuario),
          id_categoria: Number(this.declaracionForm.id_categoria),
          anio_periodo: Number(this.declaracionForm.anio_periodo),
          mes_periodo: Number(this.declaracionForm.mes_periodo),
          cantidad_kg: Number(this.declaracionForm.cantidad_kg),
          observacion: this.declaracionForm.observacion,
        };

        if (this.declaracionForm.id_declaracion) {
          await this.api(`/api/declaraciones/${this.declaracionForm.id_declaracion}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
          this.notify('La declaración quedó actualizada.');
        } else {
          await this.api('/api/declaraciones', { method: 'POST', body: JSON.stringify(payload) });
          this.notify('La declaración quedó registrada.');
        }

        this.resetDeclaracionForm();
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude guardar la declaración.', 'error');
      }
    },
    async deleteDeclaracion(id) {
      if (!window.confirm(`¿Deseas eliminar la declaración #${id}?`)) return;
      try {
        await this.api(`/api/declaraciones/${id}`, { method: 'DELETE' });
        this.notify(`Se eliminó la declaración #${id}.`);
        if (this.declaracionForm.id_declaracion === id) this.resetDeclaracionForm();
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude eliminar la declaración.', 'error');
      }
    },
    async changeEstado(id, accion) {
      try {
        await this.api(`/api/declaraciones/${id}/estado`, {
          method: 'PUT',
          body: JSON.stringify({ accion }),
        });
        this.notify(`La declaración #${id} quedó ${accion === 'validar' ? 'validada' : 'rechazada'}.`);
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude cambiar el estado de la declaración.', 'error');
      }
    },
    async markAlerta(id, atendida) {
      try {
        await this.api(`/api/alertas/${id}/atender`, {
          method: 'PUT',
          body: JSON.stringify({ atendida }),
        });
        this.notify(`La alerta #${id} quedó actualizada.`);
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude actualizar la alerta.', 'error');
      }
    },
    editCategoria(item) {
      this.categoriaForm = {
        id_categoria: item.id_categoria,
        nombre_categoria: item.nombre_categoria,
        descripcion: item.descripcion || '',
        activo: item.activo,
      };
      this.currentView = 'admin';
      this.notify(`Cargué la categoría #${item.id_categoria} para editarla.`);
    },
    async saveCategoria() {
      try {
        const payload = {
          nombre_categoria: this.categoriaForm.nombre_categoria,
          descripcion: this.categoriaForm.descripcion,
          activo: this.categoriaForm.activo,
        };
        if (this.categoriaForm.id_categoria) {
          await this.api(`/api/categorias/${this.categoriaForm.id_categoria}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
          });
          this.notify('La categoría quedó actualizada.');
        } else {
          await this.api('/api/categorias', { method: 'POST', body: JSON.stringify(payload) });
          this.notify('La categoría REP quedó creada.');
        }
        this.resetCategoriaForm();
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude guardar la categoría.', 'error');
      }
    },
    async deleteCategoria(id) {
      if (!window.confirm(`¿Deseas eliminar la categoría #${id}?`)) return;
      try {
        await this.api(`/api/categorias/${id}`, { method: 'DELETE' });
        this.notify(`Se eliminó la categoría #${id}.`);
        if (this.categoriaForm.id_categoria === id) this.resetCategoriaForm();
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude eliminar la categoría.', 'error');
      }
    },
    editMeta(item) {
      this.metaForm = {
        id_meta: item.id_meta,
        id_categoria: String(item.id_categoria),
        anio: item.anio,
        porcentaje_meta: item.porcentaje_meta,
      };
      this.currentView = 'admin';
      this.notify(`Cargué la meta #${item.id_meta} para editarla.`);
    },
    async saveMeta() {
      try {
        const payload = {
          id_categoria: Number(this.metaForm.id_categoria),
          anio: Number(this.metaForm.anio),
          porcentaje_meta: Number(this.metaForm.porcentaje_meta),
        };
        if (this.metaForm.id_meta) {
          await this.api(`/api/metas/${this.metaForm.id_meta}`, { method: 'PUT', body: JSON.stringify(payload) });
          this.notify('La meta anual quedó actualizada.');
        } else {
          await this.api('/api/metas', { method: 'POST', body: JSON.stringify(payload) });
          this.notify('La meta anual quedó creada.');
        }
        this.resetMetaForm();
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude guardar la meta anual.', 'error');
      }
    },
    async deleteMeta(id) {
      if (!window.confirm(`¿Deseas eliminar la meta #${id}?`)) return;
      try {
        await this.api(`/api/metas/${id}`, { method: 'DELETE' });
        this.notify(`Se eliminó la meta #${id}.`);
        if (this.metaForm.id_meta === id) this.resetMetaForm();
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude eliminar la meta anual.', 'error');
      }
    },
    editRegla(item) {
      this.reglaForm = {
        id_regla: item.id_regla,
        codigo_regla: item.codigo_regla,
        nombre_regla: item.nombre_regla,
        descripcion: item.descripcion,
        valor_min: item.valor_min ?? '',
        valor_max: item.valor_max ?? '',
        activo: item.activo,
      };
      this.currentView = 'admin';
      this.notify(`Cargué la regla ${item.codigo_regla} para editarla.`);
    },
    async saveRegla() {
      try {
        const payload = {
          codigo_regla: this.reglaForm.codigo_regla,
          nombre_regla: this.reglaForm.nombre_regla,
          descripcion: this.reglaForm.descripcion,
          valor_min: this.reglaForm.valor_min === '' ? null : Number(this.reglaForm.valor_min),
          valor_max: this.reglaForm.valor_max === '' ? null : Number(this.reglaForm.valor_max),
          activo: this.reglaForm.activo,
        };
        if (this.reglaForm.id_regla) {
          await this.api(`/api/reglas/${this.reglaForm.id_regla}`, { method: 'PUT', body: JSON.stringify(payload) });
          this.notify('La regla quedó actualizada.');
        } else {
          await this.api('/api/reglas', { method: 'POST', body: JSON.stringify(payload) });
          this.notify('La regla quedó creada.');
        }
        this.resetReglaForm();
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude guardar la regla.', 'error');
      }
    },
    async deleteRegla(id) {
      if (!window.confirm(`¿Deseas eliminar la regla #${id}?`)) return;
      try {
        await this.api(`/api/reglas/${id}`, { method: 'DELETE' });
        this.notify(`Se eliminó la regla #${id}.`);
        if (this.reglaForm.id_regla === id) this.resetReglaForm();
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude eliminar la regla.', 'error');
      }
    },
    editUsuario(item) {
      this.usuarioForm = {
        id_usuario: item.id_usuario,
        nombre: item.nombre,
        email: item.email,
        id_rol: String(item.id_rol),
        password: '',
        activo: item.activo,
      };
      this.currentView = 'admin';
      this.notify(`Cargué el usuario #${item.id_usuario} para editarlo.`);
    },
    async saveUsuario() {
      try {
        const payload = {
          nombre: this.usuarioForm.nombre,
          email: this.usuarioForm.email,
          id_rol: Number(this.usuarioForm.id_rol),
          password: this.usuarioForm.password,
          activo: this.usuarioForm.activo,
        };
        if (this.usuarioForm.id_usuario) {
          await this.api(`/api/usuarios/${this.usuarioForm.id_usuario}`, { method: 'PUT', body: JSON.stringify(payload) });
          this.notify('El usuario quedó actualizado.');
        } else {
          await this.api('/api/usuarios', { method: 'POST', body: JSON.stringify(payload) });
          this.notify('El usuario quedó creado.');
        }
        this.resetUsuarioForm();
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude guardar el usuario.', 'error');
      }
    },
    async deleteUsuario(id) {
      if (!window.confirm(`¿Deseas eliminar el usuario #${id}?`)) return;
      try {
        await this.api(`/api/usuarios/${id}`, { method: 'DELETE' });
        this.notify(`Se eliminó el usuario #${id}.`);
        if (this.usuarioForm.id_usuario === id) this.resetUsuarioForm();
        await this.loadAll();
      } catch (error) {
        this.notify(error.message || 'No pude eliminar el usuario.', 'error');
      }
    },
  },
  async mounted() {
    this.resetDeclaracionForm();
    this.resetCategoriaForm();
    this.resetMetaForm();
    this.resetReglaForm();
    this.resetUsuarioForm();
    await this.checkHealth();
    if (this.restoreSession()) {
      await this.loadAll();
    }
  },
};

</script>
