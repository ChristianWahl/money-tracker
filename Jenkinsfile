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
                sh 'pwd'
                sh 'ls -al'
                sh 'npm install'
                sh 'npm install typescript'
            }
        }
        stage('Build') {
            steps {
                sh 'pwd'
                sh 'ls -al'
                sh 'node_modules/react-scripts/bin/react-scripts.js build'
            }
        }
    }
}
