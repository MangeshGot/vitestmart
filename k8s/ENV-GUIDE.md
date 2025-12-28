# How to Provide MongoDB URI to Kubernetes Pods

## Current Setup ✅

You're using **Method 1** (envFrom with ConfigMap), which is already configured in your `deployment.yaml`.

---

## Method 1: Using `envFrom` (All Variables from ConfigMap) - CURRENT

**ConfigMap** (`mongodb-configmap.yaml`):
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: mongodb-configmap
data:
  MONGODB_URI: "mongodb://localhost:27017/vitestmart"
```

**Deployment** (already updated):
```yaml
envFrom:
  - configMapRef:
      name: mongodb-configmap
```

**How it works:**
- Loads ALL key-value pairs from the ConfigMap as environment variables
- `MONGODB_URI` becomes available in your pod as `process.env.MONGODB_URI`

**Deploy:**
```bash
kubectl apply -f k8s/mongodb-configmap.yaml
kubectl apply -f k8s/deployment.yaml
```

---

## Method 2: Using `env` (Specific Variables from ConfigMap)

If you want to pick specific variables or rename them:

```yaml
env:
  - name: MONGODB_URI
    valueFrom:
      configMapKeyRef:
        name: mongodb-configmap
        key: MONGODB_URI
```

**Pros:** More control, can rename variables
**Cons:** More verbose

---

## Method 3: Using Secrets (For Sensitive Data) 🔒

**Better for production!** Secrets are base64 encoded and can be encrypted at rest.

**Create Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: mongodb-secret
type: Opaque
stringData:
  MONGODB_URI: "mongodb://admin:password@mongodb:27017/vitestmart"
```

**Use in Deployment:**
```yaml
envFrom:
  - secretRef:
      name: mongodb-secret
```

**Or specific variable:**
```yaml
env:
  - name: MONGODB_URI
    valueFrom:
      secretKeyRef:
        name: mongodb-secret
        key: MONGODB_URI
```

---

## Method 4: Hardcoded in Deployment (Not Recommended)

```yaml
env:
  - name: MONGODB_URI
    value: "mongodb://localhost:27017/vitestmart"
```

**Cons:** 
- Not flexible
- Requires redeployment for changes
- Credentials visible in deployment YAML

---

## Complete Example with Multiple Sources

You can combine ConfigMap and Secret:

```yaml
spec:
  containers:
    - name: vitestmart
      image: mangeshgot/vitestmart:1.0
      ports:
        - containerPort: 5000
      # Load all from ConfigMap (non-sensitive)
      envFrom:
        - configMapRef:
            name: app-config
      # Load specific from Secret (sensitive)
      env:
        - name: MONGODB_URI
          valueFrom:
            secretKeyRef:
              name: mongodb-secret
              key: MONGODB_URI
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: JWT_SECRET
```

---

## Verification

After deploying, verify the environment variable is set:

```bash
# Get pod name
kubectl get pods

# Check environment variables
kubectl exec <pod-name> -- env | grep MONGODB_URI

# Or enter the pod
kubectl exec -it <pod-name> -- sh
echo $MONGODB_URI
```

---

## Best Practices 🎯

1. **Use ConfigMap for:** Non-sensitive configuration (ports, feature flags, URLs)
2. **Use Secrets for:** Passwords, API keys, connection strings with credentials
3. **Never hardcode:** Sensitive data in deployment files
4. **Use external secret managers:** For production (AWS Secrets Manager, HashiCorp Vault)

---

## Your Current Flow

1. ✅ ConfigMap defines `MONGODB_URI`
2. ✅ Deployment references it with `envFrom`
3. ✅ Pod receives it as environment variable
4. ✅ Your Node.js app reads it with `process.env.MONGODB_URI`

**Deploy it:**
```bash
kubectl apply -f k8s/mongodb-configmap.yaml
kubectl apply -f k8s/deployment.yaml
```

Done! 🚀
