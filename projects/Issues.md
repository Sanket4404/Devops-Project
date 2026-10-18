# Issues Faced During Implementation

## Infrastructure

### 1. Node Group Pod Capacity Issue

- **Problem**: While creating the node group via `t3.medium`, it worked initially as there was no monitoring and ArgoCD setup done initially. When the replicas of microservices app were increased, the error faced was "too many resources, too many pods, no new claims to deallocate".

- **Root Cause**: The `t3.medium` (specs: 2 vCPU, 4 GB RAM) instance type can only have the capacity of 17 pods. Since the default namespace already has pods and the replica count was 2 of each service, the "too many pods" error occurred.

- **Solution**: Upgraded the instance type to `t3.large` (specs: 2 vCPU, 8 GB RAM) which has a capacity of 35 pods.

### 2. EBS Volume Permission Issue

- **Problem**: While attaching the EBS volume, there was a permission issue.

- **Root Cause**: Kubernetes version greater than 1.32 in AWS EKS requires the IRSA (IAM Roles for Service Accounts) policy to be attached. IAM alone cannot handle the EBS attach to EKS.

- **Solution**: Configured IRSA policy for the EBS CSI driver.

---

## Database Issue

### 1. StatefulSet Init Script Failure

- **Problem**: Even though the StatefulSet was attached with an init script which had a DB dump in it, it was still failing to initialize. It was skipping the DB initializing resulting in "products page not found".

- **Root Cause**: The EBS has a folder by default named lost+found , so Postgres was considering that as the volume is not empty and it was skipping the initialisation resulting in the products pod running smoothly but when checking the logs, it was showing the product_db doesn't exist. 

- **Solution**: Created a DB-restore Job to add the DB. The correct step is to apply the DB-restore Job after the PostgreSQL pod is up and running.
- **Steps to Fix**:
  1. Wait for the PostgreSQL pod to be up and running
  2. Apply the DB-restore Job
  3. If the Job fails initially, delete the DB-restore Job and reapply it after the PostgreSQL pod is ready

---

## Monitoring

### 1. Boutique Application Metrics Not Found

- **Problem**: Even though the metrics of the cluster and node were obtained, the Boutique Application Metrics were not available. While running it via docker compose, it was showing the metrics properly. 

- **Root Cause**: The ServiceMonitor was configured with the path as `/metrics` but the application metrics were not being scraped properly.

- **Solution**: Added a ServiceMonitor with the correct path (`/metrics`) and updated the service file of the gateway so that the Grafana dashboard can have the data of the application with source as Prometheus.

---

