<script setup lang="ts">
</script>

<template>
  <div class="home-container">
    <!-- Hero Section -->
    <div class="hero-section text-center py-5">
      <h1 class="display-4">Gestión de Programas de Postgrado USFX</h1>
      <p class="lead">Sistema integral para la administración de programas de postgrado</p>
    </div>

    <!-- Features Section -->
    <div class="row mt-5">
      <div class="col-md-6">
        <div class="card feature-card">
          <div class="card-body text-center">
            <i class="bi bi-book fs-1 text-primary mb-3"></i>
            <h3 class="card-title">Programas</h3>
            <p class="card-text">Gestión completa de programas de postgrado, maestrías y doctorados.</p>
            <RouterLink to="/programas" class="btn btn-primary">Ver Programas</RouterLink>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card feature-card">
          <div class="card-body text-center">
            <i class="bi bi-mortarboard fs-1 text-primary mb-3"></i>
            <h3 class="card-title">Niveles Académicos</h3>
            <p class="card-text">Administración de diferentes niveles académicos y sus requisitos.</p>
            <RouterLink to="/niveles-academicos" class="btn btn-primary">Ver Niveles</RouterLink>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 20px;
}

.hero-section {
  background: linear-gradient(to right, #e3f2fd, #bbdefb);
  border-radius: 10px;
  padding: 40px;
  margin-bottom: 30px;
}

.feature-card {
  transition: transform 0.3s ease;
  height: 100%;
  border: none;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.feature-card:hover {
  transform: translateY(-5px);
}

.card-body {
  padding: 2rem;
}

.btn-primary {
  margin-top: 1rem;
}
</style>
