pipeline {
    agent { docker { image 'node:15-alpine' } }
    stages {
        stage('Install dependencies') {
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
            steps {
                sh 'npm run lint'
            }
        }
        stage('Build') {
            steps {
                sh 'npm install typescript react-scripts'
                sh 'npm run build'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
