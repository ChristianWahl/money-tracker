# How to set up the CI/CD infrastructure
*(January 2021)*

## Prerequisites
* Create IAM users with programmatic access for: **jenkins-moneytracker-ecr** and **jenkins-moneytracker-eks**.
* Assign the corresponding policies.
* Create a keypair to be used with your EC2 and Kubernetes setup.
* Create an ECR in AWS and adapt the variable in Jenkinsfile.

## 1. Create Jenkins EC2 instance
```
cd ./cicd-infra/aws-cf-helper
./create.sh YOUR-STACKNAME ../jenkins/jenkins-ec2-instance.yml ../jenkins/jenkins-ec2-instance-parameters.json YOUR-REGION
```

## 2. Run Ansible playbook example:
Get your EC2 instance ip/dns from Cloudformation before and add it to the inventory.

Note: `ansible-playbook` needs to be installed.
```
cd ./cicd-infra/jenkins/ansible
ansible-playbook --key-file YOUR-KEYPAIR -i inventory.txt setup-jenkins.yml
```

## 3. Configure Jenkins
* Login to your EC2 instance ip/dns on port 8080.
* Install all recommended plugins.
* Create a user.
* Disable GitHub API usage in settings (optional).
* Add "**docker**" label to your "**master**" node.
* Add docker installation in helper applications (leave path blank).
* Install the following plugins:
    * Pipeline: Multibranch with defaults.
    * Docker Pipeline.
    * Amazon ECR.
    * Pipeline: AWS Steps.
* Add **jenkins-moneytracker-eks** and **jenkins-moneytracker-ecr** credentials.
* Connect the repo to Jenkins (maybe as multibranch).

##4. Create a Kubernetes cluster
* SSH to your Jenkins EC2 instance.
* Type `aws configure`.
* Enter credentials and region for created user: `jenkins-moneytracker-eks`
* Copy/Paste or scp `create-cluster.sh` from `./cicd-infra/kubernetes` to your EC2 instance.
* Launch Kubernetes cluster.
    * Example: `moneytracker eu-central-1 YOUR-KEYPAIR`
    * Note: `moneytracker` caption is required. Otherwise, you have to change the variable in the Jenkinsfile.

## 5. Wait
* Think about the universe and why aliens haven't reached us yet (approx. for 30 minutes).

## 5. Run
* Run the Jenkins job manually.

## Work to be done after the pipeline works
* Add webhooks.
* Add more pipeline stages / steps if you want.
* Add swap space to your EC2 instance.
* Remove built docker images in pipeline.
* Change deployment from rolling to blue/green if required.
* ...Any ideas you might have.


