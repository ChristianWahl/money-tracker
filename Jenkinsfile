pipeline {
    environment {
        registry = 'public.ecr.aws/z9p8y5e8/cwa-prod'
        registryCredential = 'ID_OF_MY_AWS_JENKINS_CREDENTIAL'
        dockerImage = 'moneytracker'
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
                    dockerImage = docker.build registry + ":$BUILD_NUMBER"
                    docker.withRegistry('https://' + registry) {
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
