pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "192.241.148.118:5000"
        PROJECT_DIR = "/root/dog_project"
        CI = "true" 
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'develop', 
                url: 'https://github.com/AnaLucia134/fronted_dog.git',
                credentialsId: 'github-credentials'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
                sh 'npm install --save-dev jest-junit babel-jest identity-obj-proxy'
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    try {
                        sh 'npm test -- --watchAll=false --coverage --reporters=default --reporters=jest-junit'
                        junit 'junit.xml'
                    } catch (error) {
                        echo "Tests failed: ${error}"
                        currentBuild.result = 'UNSTABLE'
                    }
                }
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint || true' 
            }
        }

        stage('Build') {
            steps {
                script {
                    withEnv(['CI=false']) {
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Docker Image') {
            when {
                expression { currentBuild.result != 'FAILURE' }
            }
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/frontend-dog:${env.BUILD_ID}")
                }
            }
        }

        stage('Push to Registry') {
            when {
                expression { currentBuild.result != 'FAILURE' }
            }
            steps {
                script {
                    docker.withRegistry("http://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        docker.image("${DOCKER_REGISTRY}/frontend-dog:${env.BUILD_ID}").push()
                        docker.image("${DOCKER_REGISTRY}/frontend-dog:latest").push()
                    }
                }
            }
        }

        stage('Deploy to QA') {
            when {
                branch 'develop'
                expression { currentBuild.result != 'FAILURE' }
            }
            steps {
                sh """
                    cd ${PROJECT_DIR}
                    docker-compose -f docker-compose-qa.yml down
                    docker-compose -f docker-compose-qa.yml up -d --scale frontend=3
                """
            }
        }
    }

    post {
        always {
            cleanWs()
            script {
                if (fileExists('coverage/lcov-report/index.html')) {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
    }
}

