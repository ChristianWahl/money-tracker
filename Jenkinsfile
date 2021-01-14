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
                sh 'npm install -g typescript react-scripts'
            }
        }
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
