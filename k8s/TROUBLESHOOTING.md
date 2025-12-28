# Debugging CrashLoopBackOff - Step by Step Guide

## What is CrashLoopBackOff?

When a pod is in **CrashLoopBackOff**, it means:
1. The pod starts
2. The container crashes
3. Kubernetes tries to restart it
4. It crashes again
5. Kubernetes waits longer each time before restarting (backoff)

---

## Common Causes for Your Vitestmart App

### 1. **MongoDB Connection Failure** (Most Likely)
Your app tries to connect to MongoDB but fails, causing the app to crash.

**Why?**
- MongoDB URI might be incorrect
- MongoDB service not accessible from the pod
- Network issues

### 2. **Missing Environment Variables**
Your app expects certain env vars that aren't set.

### 3. **Application Error**
Bug in your code that causes it to crash on startup.

### 4. **Port Already in Use**
Another process using port 5000 inside the container.

---

## How to Debug (Run These Commands)

### Step 1: Check Pod Status
```bash
sudo kubectl get pods
```

**Look for:**
```
NAME                          READY   STATUS             RESTARTS
vitestmart-xxxxx-xxxxx        0/1     CrashLoopBackOff   5
```

### Step 2: Describe the Pod (Most Important!)
```bash
# Replace <pod-name> with actual pod name from step 1
sudo kubectl describe pod <pod-name>
```

**Look for:**
- `State: Waiting` with `Reason: CrashLoopBackOff`
- `Last State: Terminated` with `Exit Code` and `Reason`
- Events at the bottom showing errors

### Step 3: Check Pod Logs
```bash
# Get current logs
sudo kubectl logs <pod-name>

# Get previous crash logs (most useful!)
sudo kubectl logs <pod-name> --previous
```

**Common errors you might see:**
```
MongooseServerSelectionError: connect ECONNREFUSED
Error: Cannot find module 'express'
Error: listen EADDRINUSE: address already in use :::5000
```

### Step 4: Check All Pods
```bash
sudo kubectl get pods -o wide
```

---

## Quick Fixes Based on Common Issues

### Fix 1: MongoDB Connection Issue

**Problem:** Your MongoDB URI in deployment.yaml points to MongoDB Atlas, but the connection might be failing.

**Check your deployment.yaml:**
```yaml
env:
  - name: MONGODB_URI
    value: "mongodb+srv://mangeshforstudy_db_user:sNdbqYh89gmYIg8L@cluster0.cukhoit.mongodb.net/?appName=Cluster0"
```

**Possible issues:**
1. **Password has special characters** - Needs URL encoding
2. **Network policy** - MongoDB Atlas might block Kubernetes cluster IPs
3. **Database name missing** - Add `/vitestmart` before `?appName`

**Try this fix:**
```yaml
env:
  - name: MONGODB_URI
    value: "mongodb+srv://mangeshforstudy_db_user:sNdbqYh89gmYIg8L@cluster0.cukhoit.mongodb.net/vitestmart?retryWrites=true&w=majority"
```

### Fix 2: Add Database Name

Your current URI doesn't specify a database. Update it:

```yaml
- name: MONGODB_URI
  value: "mongodb+srv://mangeshforstudy_db_user:sNdbqYh89gmYIg8L@cluster0.cukhoit.mongodb.net/vitestmart?retryWrites=true&w=majority&appName=Cluster0"
```

### Fix 3: Check if Image Exists

```bash
# Check if your image is accessible
sudo kubectl describe pod <pod-name> | grep -A 5 "Image"
```

If you see `ImagePullBackOff`, your image isn't available.

### Fix 4: Add Liveness/Readiness Probes

Your app might be starting slowly. Add this to deployment.yaml:

```yaml
spec:
  containers:
    - name: vitestmart
      image: mangeshgot/vitestmart:1.0
      env:
        - name: MONGODB_URI
          value: "mongodb+srv://..."
        - name: PORT
          value: "5000"
      ports:
        - containerPort: 5000
      # Add these probes
      livenessProbe:
        httpGet:
          path: /
          port: 5000
        initialDelaySeconds: 30
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /
          port: 5000
        initialDelaySeconds: 10
        periodSeconds: 5
```

---

## Debugging Workflow

1. **Get pod name:**
   ```bash
   sudo kubectl get pods
   ```

2. **Check logs (previous crash):**
   ```bash
   sudo kubectl logs <pod-name> --previous
   ```

3. **Look for error message** - This tells you exactly what's wrong

4. **Common errors and fixes:**

   | Error Message | Fix |
   |---------------|-----|
   | `MongooseServerSelectionError` | Fix MongoDB URI |
   | `Cannot find module` | Rebuild Docker image with dependencies |
   | `EADDRINUSE` | Change PORT or fix app code |
   | `Application error` | Check app logs for specific error |

---

## Test Your MongoDB Connection

To verify MongoDB Atlas is accessible:

```bash
# Create a test pod
sudo kubectl run mongodb-test --image=mongo:7.0 --rm -it --restart=Never -- mongosh "mongodb+srv://mangeshforstudy_db_user:sNdbqYh89gmYIg8L@cluster0.cukhoit.mongodb.net/vitestmart"
```

If this fails, your MongoDB URI has issues.

---

## Next Steps

1. Run `sudo kubectl logs <pod-name> --previous`
2. Copy the error message
3. Share it with me so I can help you fix it!

The logs will tell us EXACTLY why your app is crashing. 🔍
