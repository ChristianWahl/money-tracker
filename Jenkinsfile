pipeline {
    environment {
        awsRegion = 'eu-central-1'
        registry = '634819049956.dkr.ecr.' + '$awsRegion' + '.amazonaws.com'
        registryCredential = 'ecr:' + '$awsRegion' + ':jenkins-moneytracker-ecr'
        dockerImage = 'moneytracker-prod'
        cluster = 'moneytracker-cluster'
        clusterCredential = 'jenkins-moneytracker-eks'
    }
    agent { label 'docker' }
    stages {
//         stage('Install dependencies') {
//             agent {
//                 docker {
//                     reuseNode true
//                     image 'node:15-alpine'
//                 }
//             }
//             environment {
//                 /*
//                  * Change HOME, because default is usually root dir, and
//                  * Jenkins user may not have write permissions in that dir.
//                  */
//                 HOME = "${WORKSPACE}"
//             }
//             steps {
//                 sh 'npm install'
//             }
//         }
//         stage('Lint') {
//             agent {
//                 docker {
//                     reuseNode true
//                     image 'node:15-alpine'
//                 }
//             }
//             steps {
//                 sh 'npm run lint'
//             }
//         }
//         stage('Build') {
//             agent {
//                 docker {
//                     reuseNode true
//                     image 'node:15-alpine'
//                 }
//             }
//             steps {
//                 sh 'npm install typescript react-scripts'
//                 sh 'npm run build'
//             }
//         }
//         stage('Test') {
//             agent {
//                 docker {
//                     reuseNode true
//                     image 'node:15-alpine'
//                 }
//             }
//             steps {
//                 sh 'CI=true npm run test'
//             }
//         }
//         stage('Build and Publish Image') {
//             when {
//                 branch 'master'
//             }
//             steps {
//                 script {
//                     dockerImage = docker.build registry + '/' + dockerImage + ":$BUILD_NUMBER"
//                     docker.withRegistry('https://' + registry, registryCredential) {
//                         dockerImage.push()
//                     }
//                 }
//             }
//         }
        stage('Get Kube Config') {
            steps {
                withAWS(region: awsRegion, credentials: clusterCredential) {
                    sh 'aws eks --region $awsRegion update-kubeconfig --name $cluster'
                }
            }
        }
        stage('Deploy Image to Cluster') {
            steps {
                sh '''
                    export IMAGE="registry + '/' + dockerImage + ':$BUILD_NUMBER'"
                    sed -ie "s~IMAGE~$IMAGE~g" deploy/kubernetes.yml
                    kubectl apply -f ./deploy
                    '''
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
