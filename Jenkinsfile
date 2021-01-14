pipeline {
    agent { docker { image 'node:15-alpine' } }
    stages {
        stage('Install dependencies') {
            steps {
                sh 'ls -al'
                sh 'npm install'
            }
        }
        stage('build') {
            steps {
                sh 'npm run build'
            }
        }
    }
}
