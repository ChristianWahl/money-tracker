# Note: eksctl and kubectl must be installed

eksctl create cluster \
--name $1 \
--region $2 \
--with-oidc \
--ssh-access \
--ssh-public-key $3 \
--managed

# View your cluster nodes
kubectl get nodes -o wide

# View the workloads running on your cluster
kubectl get pods --all-namespaces -o wide
