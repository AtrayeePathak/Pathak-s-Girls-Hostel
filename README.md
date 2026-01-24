# Pathak's Girls Hostel Management System

> A cloud-native microservice application demonstrating modern DevOps practices using Kubernetes, Helm, and automated GitOps workflows.

---

## 📋 Overview

This project is a web-based management system for a girls' hostel that enables users to browse facilities, create accounts, and submit feedback. What makes this project special is its **evolution from a traditional web application into a production-grade cloud-native system** showcasing Infrastructure as Code (IaC), containerization, and automated CI/CD pipelines.

**Key Achievement:** The project demonstrates an **end-to-end GitOps workflow** where code changes automatically trigger infrastructure updates with zero downtime—all without manual intervention.

---

## 🏗️ Architecture

### High-Level Flow

```
Developer Push → GitHub Actions (CI) → Docker Image Built & Pushed 
    ↓
Helm Chart Updated → ArgoCD (CD) → Kubernetes Cluster → Live Application
```

### Architecture Diagram Description

1. **Application Layer:** A Node.js server running on Express with EJS-templated web pages.
2. **Data Layer:** MongoDB stores user registrations and feedback.
3. **Container Layer:** Docker containerizes the application for portability.
4. **Orchestration Layer:** Kubernetes (AWS EKS) manages containerized workloads.
5. **Configuration Layer:** Helm packages standardize Kubernetes deployments.
6. **Automation Layer:** GitHub Actions builds images; ArgoCD syncs cluster state.

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Backend Server** | Node.js + Express.js | Lightweight web application runtime |
| **Frontend Templates** | EJS (Embedded JavaScript) | Server-side page rendering |
| **Database** | MongoDB with Mongoose | Data persistence for users and feedback |
| **Containerization** | Docker (Multi-stage builds) | Package app into portable containers |
| **Container Registry** | Docker Hub | Store and distribute container images |
| **Orchestration** | Kubernetes (AWS EKS) | Manage containers at scale |
| **Infrastructure as Code** | Helm Charts | Parameterized Kubernetes deployments |
| **CI/CD Automation** | GitHub Actions | Automated build and push pipelines |
| **Deployment Automation** | ArgoCD | GitOps-based continuous delivery |
| **Ingress Controller** | NGINX Ingress + AWS Load Balancer | Route external traffic to the application |

---

## ⭐ The Star Feature: Automated GitOps Pipeline

This is the **core innovation** of the project—a fully automated deployment workflow requiring zero manual intervention.

### How It Works

#### **Step 1: Code Push**
- Developer commits and pushes code to the `main` branch on GitHub

#### **Step 2: GitHub Actions CI Pipeline**
```yaml
Triggers automatically on every push to main:
1. ✅ Builds a new Docker Image from the Dockerfile
2. ✅ Pushes the image to Docker Hub with a unique tag (Commit SHA)
3. ✅ Updates values.yaml in the Helm Chart with the new image tag
4. ✅ Commits the updated Helm Chart back to the repository
```

**Result:** The repository now reflects the latest application version in both code and configuration.

#### **Step 3: ArgoCD CD Pipeline**
```yaml
ArgoCD (running inside the EKS cluster) continuously monitors the repository:
1. 🔍 Detects the change in Helm Chart values
2. 🔄 Automatically syncs the Kubernetes cluster state to match Git
3. 🚀 Performs a rolling update—new Pods spin up with the new image
4. 🛑 Old Pods gracefully shut down
5. ✨ Zero downtime! Users experience no service interruption
```

**Result:** The live application is updated automatically—no `kubectl` commands needed.

---

## 📂 Project Structure

```
.
├── README.md                          # This file
├── _Copy.gitattributes
├── my_project/                        # Main application folder
│   ├── app.js                         # Express server & routes
│   ├── package.json                   # Node.js dependencies
│   ├── Dockerfile                     # Docker configuration
│   ├── test-db.js                     # Database testing utility
│   ├── views/                         # EJS page templates
│   │   ├── index.ejs                  # Home page
│   │   ├── about.ejs                  # About page
│   │   ├── facilities.ejs             # Hostel facilities page
│   │   ├── login.ejs                  # Login form
│   │   ├── signup.ejs                 # Registration form
│   │   ├── feedback.ejs               # Feedback submission form
│   │   └── learnmore.ejs              # Learn more page
│   ├── public/                        # Static assets (CSS, images)
│   │   ├── about.css
│   │   ├── facilities.css
│   │   ├── feedback.css
│   │   ├── login.css
│   │   ├── signup.css
│   │   └── file.css
│   ├── helm/                          # Helm Chart (Infrastructure as Code)
│   │   └── my-project-chart/
│   │       ├── Chart.yaml             # Helm chart metadata
│   │       ├── values.yaml            # Helm configuration (includes image tag)
│   │       └── templates/
│   │           ├── deployment.yaml    # Kubernetes Deployment template
│   │           ├── service.yaml       # Kubernetes Service template
│   │           └── ingress.yaml       # Kubernetes Ingress template
│   └── k8s/                           # Legacy: Manual Kubernetes manifests
│       └── manifest/
│           ├── deployment.yaml
│           ├── service.yaml
│           └── ingress.yaml
└── .github/workflows/                 # GitHub Actions automation
    └── ci.yaml                        # CI/CD pipeline configuration
```

---

## 🚀 Key Infrastructure Features

### **Infrastructure as Code (IaC)**
- Kubernetes deployments are defined in Helm Charts (`helm/my-project-chart/`)
- All configuration is version-controlled in Git
- Easy to replicate environments or manage changes

### **Self-Healing**
- Kubernetes automatically restarts failed Pods
- If a container crashes, Kubernetes spins up a replacement
- No manual intervention required

### **Scalability**
- **Horizontal Pod Autoscaling (HPA):** Automatically increases Pods during high traffic
- **Node Scaling:** AWS EKS can automatically add more compute nodes
- Application handles traffic spikes gracefully

### **Security**
- Secrets management for Docker Hub credentials
- GitHub tokens stored securely in Actions secrets
- Credentials never exposed in logs or repository

### **Zero-Downtime Deployments**
- Rolling updates ensure new Pods are healthy before removing old ones
- Users experience uninterrupted service during updates

---

## 📝 Application Features

The hostel management system includes:

| Feature | Endpoint | Purpose |
|---------|----------|---------|
| **Home Page** | `GET /` | Dashboard with overview |
| **About** | `GET /about` | Information about the hostel |
| **Facilities** | `GET /facilities` | Browse available amenities |
| **Sign Up** | `GET/POST /signup` | Create a new user account |
| **Login** | `GET/POST /login` | Authenticate existing users |
| **Feedback** | `GET/POST /feedback` | Submit feedback (saved to MongoDB) |

---

## 🏃 Getting Started

### Prerequisites

Ensure you have the following installed:

- **AWS Account** (for EKS cluster)
- **eksctl** (tool to create EKS clusters)
- **kubectl** (Kubernetes command-line tool)
- **Helm** (Kubernetes package manager)
- **Docker** (for local testing)
- **Git** (for repository management)

### Step 1: Create AWS EKS Cluster

```bash
eksctl create cluster \
  --name pathaks-hostel-cluster \
  --region us-east-1 \
  --nodegroup-name standard-nodes \
  --node-type t3.medium \
  --nodes 2
```

This creates a production-ready Kubernetes cluster on AWS.

### Step 2: Install ArgoCD

```bash
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

### Step 3: Connect This Repository to ArgoCD

```bash
argocd repo add https://github.com/<your-username>/<repo-name>.git
argocd app create pathaks-hostel \
  --repo https://github.com/<your-username>/<repo-name>.git \
  --path my_project/helm/my-project-chart \
  --dest-server https://kubernetes.default.svc
```

### Step 4: Verify Deployment

```bash
kubectl get pods -n default
kubectl get svc -n ingress-nginx
```

### Step 5: Access the Application

Get the external URL from the AWS Load Balancer:

```bash
kubectl get svc -n ingress-nginx
```

Open the URL in your browser. That's it! The application is now live.

---

## 🔄 Local Development

To run the application locally without Kubernetes:

```powershell
cd my_project
npm install
node app.js
```

Visit `http://localhost:3000` in your browser.

---

## 📊 Monitoring & Troubleshooting

### View Deployment Status

```bash
kubectl get deployments
kubectl describe deployment pathaks-hostel
```

### View Pod Logs

```bash
kubectl logs -f <pod-name>
```

### Check ArgoCD Sync Status

```bash
argocd app get pathaks-hostel
```

### View Ingress Routes

```bash
kubectl describe ingress pathaks-hostel-ingress
```

---

## 🔐 Security Considerations

- Store MongoDB connection strings in Kubernetes Secrets, not in code
- Use GitHub Actions secrets for Docker Hub credentials
- Implement password hashing in the login system
- Enable HTTPS/TLS at the ingress layer
- Regularly scan Docker images for vulnerabilities

---

## 📚 Learning Outcomes

This project demonstrates:

✅ **Cloud-Native Application Design**  
✅ **Container Orchestration with Kubernetes**  
✅ **Infrastructure as Code (Helm Charts)**  
✅ **CI/CD Automation (GitHub Actions + ArgoCD)**  
✅ **GitOps Principles**  
✅ **Automated Deployment Pipelines**  
✅ **Production-Grade DevOps Practices**  

---

## 📄 License

This project is part of the Web Technology curriculum.

---

## 👤 Author

**Pathak's Girls Hostel Management System**  
*A project showcasing modern DevOps and cloud-native architecture*

```powershell
# from my_project folder
node app.js
```

Optional: add a `start` script to `package.json`:

```json
"scripts": {
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

Then run `npm start` or `npm run dev`.

**Environment & Configuration**
- The current MongoDB connection URI is defined directly in `app.js` (look for the variable `uri`). Replace this with your own connection string or load it from an environment variable.
- Recommended: create a `.env` file with `MONGODB_URI=...` and update `app.js` to read `process.env.MONGODB_URI`.

**Database Collections**
- `registration` — stores user documents with fields: `name`, `email`, `password` (currently stored in plaintext in the DB; see Security Notes).
- `feedback` — stores feedback messages with `name`, `email`, `message`, `timestamp`.

**Static Assets / Images**
- Place project images under `my_project/public/images/`.
- Examples used in templates:
  - header logo: `/images/pathaks-logo.png`
  - login background: `/images/login-bg.png`

**Security Notes & Recommendations**
- Passwords are currently stored and compared as plaintext — NOT secure. Replace with a password hashing solution such as `bcrypt` before using in production.
- Move sensitive configuration (DB credentials, session secret) to environment variables and never commit them.
- Consider enabling HTTPS and configuring session cookie options for security.

**Repository Clean-up Info**
- A `.gitignore` exists to ignore `node_modules/`. The repository history previously included node modules and accidental duplicate files; those were removed from tracking but remain in earlier commits. If you need to permanently purge large files from history, use tools like `git filter-repo` or BFG (requires care and force-push).

**Testing feedback form locally**
1. Start the app (`node app.js`).
2. Open `http://localhost:5000/feedback` in your browser.
3. Submit the form — successful submissions display a confirmation alert and create a document in the `feedback` collection.

**Developer Notes**
- To add the logo or background images, copy files into `my_project/public/images/` and name them to match the paths used in templates (for example `pathaks-logo.png` and `login-bg.png`).
- Example PowerShell to add an image (run from repo root):

```powershell
mkdir .\\my_project\\public\\images -Force
Copy-Item 'C:\\Users\\You\\Downloads\\pathaks-logo.png' -Destination '.\\my_project\\public\\images\\pathaks-logo.png' -Force
```


