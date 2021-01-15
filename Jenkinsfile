pipeline {
    environment {
        registry = '634819049956.dkr.ecr.eu-central-1.amazonaws.com'
        registryCredential = 'ecr:eu-central-1:jenkins-moneytracker-ecr'
        dockerImage = 'moneytracker-prod'
    }
    agent { label 'docker' }
    stages {
        stage('Install dependencies') {
            agent {
                docker {
                    reuseNode true
                    image 'node:15-alpine'
                }
            }
            environment {
                /*
                 * Change HOME, because default is usually root dir, and
                 * Jenkins user may not have write permissions in that dir.
                 */
                HOME = "${WORKSPACE}"
            }
            steps {
                sh 'npm install'
            }
        }
        stage('Lint') {
            agent {
                docker {
                    reuseNode true
                    image 'node:15-alpine'
                }
            }
            steps {
                sh 'npm run lint'
            }
        }
        stage('Build') {
            agent {
                docker {
                    reuseNode true
                    image 'node:15-alpine'
                }
            }
            steps {
                sh 'npm install typescript react-scripts'
                sh 'npm run build'
            }
        }
        stage('Test') {
            agent {
                docker {
                    reuseNode true
                    image 'node:15-alpine'
                }
            }
            steps {
                sh 'CI=true npm run test'
            }
        }
        stage('Build and Publish Image') {
            when {
                branch 'master'
            }
            steps {
                script {
                    dockerImage = docker.build registry + '/' + dockerImage + ":$BUILD_NUMBER"
                    docker.withRegistry('https://' + registry, registryCredential) {
                        dockerImage.push()
                    }
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
