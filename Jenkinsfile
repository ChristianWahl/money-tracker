pipeline {
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
                docker.withRegistry('public.ecr.aws/z9p8y5e8/cwa-prod') {
                    def customImage = docker.build("money-tracker:${env.BUILD_ID}")
                    /* Push the container to the custom Registry */
                    customImage.push()
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
