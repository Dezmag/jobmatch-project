# Створення віртуальної мережі (VPC)
resource "google_compute_network" "main_vpc" {
  name                    = "bookshop-vpc"
  auto_create_subnetworks = false
}

# Створення приватної підмережі для Kubernetes нод
resource "google_compute_subnetwork" "private_subnet" {
  name          = "k8s-private-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = "us-central1"
  network       = google_compute_network.main_vpc.id

  # Вмикаємо приватний доступ до Google (важно для безопасности)
  private_ip_google_access = true
}

# Стоворимо Cloud Router 
resource "google_compute_router" "router" {
  name    = "k8s-router"
  region  = "us-central1"
  network = google_compute_network.main_vpc.id
}

# Створимо Cloud NAT
resource "google_compute_nat" "nat" {
  name                               = "k8s-nat"
  router                             = google_compute_router.router.name
  region                             = google_compute_router.router.region
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"
}
