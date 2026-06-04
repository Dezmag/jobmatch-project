resource "google_container_cluster" "primary" {
  name     = "jobmatch-cluster"
  location = "us-central1-a" # Зона внутри региона

  network    = google_compute_network.main_vpc.name
  subnetwork = google_compute_subnetwork.private_subnet.name

  
  remove_default_node_pool = true
  initial_node_count       = 1

  
  ip_allocation_policy {}
}

resource "google_container_node_pool" "primary_nodes" {
  name       = "jobmatch-node-pool"
  location   = "us-central1-a"
  cluster    = google_container_cluster.primary.name
  node_count = 2 # 2 ноды обеспечат высокую доступность и скорость

  node_config {
    preemptible  = true # Используем спотовые ноды, они на 70% дешевле! (Экономим баланс)
    machine_type = "e2-standard-2"

    labels = {
      env = "dev"
    }

    oauth_scopes = [
      "https://googleapis.com",
      "https://googleapis.com",
    ]
  }
}
