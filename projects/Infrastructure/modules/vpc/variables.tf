variable "vpc_name" {
  type = string
}

variable "cidr_block" {
  type = string
}

variable "availability_zones" {
  type = list(string)
}

variable "subnet_cidrs" {
  type = list(string)
}

variable "cluster_name" {
  description = "EKS cluster name for subnet tagging"
  type        = string
}
