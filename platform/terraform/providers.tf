Set-Content -Path "platform\terraform\providers.tf" -Value @"
terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = "bookshop-project-498317"
  region  = "us-central1"
}
"@
