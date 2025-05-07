pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "192.241.148.118:5000"
        PROJECT_DIR = "/root/dog_project"
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
                sh 'npm install --save-dev jest-junit'
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
                sh 'npm run lint || true' // Continúa aunque haya warnings
            }
        }

        stage('Build') {
            when {
                expression { currentBuild.result != 'FAILURE' }
            }
            steps {
                sh 'npm run build'
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
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'coverage/lcov-report',
                reportFiles: 'index.html',
                reportName: 'Coverage Report'
            ])
        }
        failure {
            emailext (
                subject: "Pipeline FAILED: ${currentBuild.fullDisplayName}",
                body: "Check console output at ${env.BUILD_URL}",
                to: 'ana@example.com',
                replyTo: 'ana@example.com',
                attachLog: true
            )
        }
        unstable {
            emailext (
                subject: "Pipeline UNSTABLE: ${currentBuild.fullDisplayName}",
                body: "Tests unstable. Check ${env.BUILD_URL}",
                to: 'ana@example.com',
                replyTo: 'ana@example.com'
            )
        }
    }
}
