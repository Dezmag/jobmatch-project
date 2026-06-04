# 1. Описуємо сам керуючий Kubernetes кластер (GKE)
resource "google_container_cluster" "primary" {
  name     = "jobmatch-cluster"
  location = "us-central1-a"

  network    = google_compute_network.main_vpc.name
  subnetwork = google_compute_subnetwork.private_subnet.name

  remove_default_node_pool = true
  initial_node_count       = 1

  ip_allocation_policy {}
}

# 2. Описуємо пул робочих нод (Node Pool)
resource "google_container_node_pool" "primary_nodes" {
  name       = "jobmatch-node-pool"
  location   = "us-central1-a"
  cluster    = google_container_cluster.primary.name
  node_count = 2

  node_config {
    preemptible  = true # Економимо твої тестові $300 балансу
    machine_type = "e2-standard-2"

    labels = {
      env = "dev"
    }

    # Універсальний скоуп, який вирішує проблему INVALID_SCOPE
     oauth_scopes = [
    "https://www.googleapis.com/auth/cloud-platform"
  ]
  }
}
