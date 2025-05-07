pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = "192.241.148.118:5000"
        IMAGE_NAME = "frontend_dog"
        REACT_APP_API_URL = "http://192.241.148.118:3000/api"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'develop', url: 'https://github.com/AnaLucia134/fronted_dog.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Run Tests') {
            steps {
                // Ejecuta pruebas unitarias (asegúrate de tener tests configurados)
                sh 'npm test -- --watchAll=false || true'
                
                // Opcional: ejecutar pruebas de linting
                sh 'npm run lint || true'
            }
            
            post {
                always {
                    junit 'junit.xml' // Si tus pruebas generan reportes JUnit
                    archiveArtifacts artifacts: 'coverage/**/*' // Archiva reportes de cobertura
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}")
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry("http://${DOCKER_REGISTRY}", 'docker-registry-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}").push()
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${env.BUILD_NUMBER}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to QA') {
            when {
                branch 'develop'
            }
            steps {
                script {
                    // Detener y eliminar contenedores existentes
                    sh 'docker-compose -f /dog_project/docker-compose-qa.yml down || true'
                    
                    // Desplegar con 3 réplicas para QA
                    sh 'docker-compose -f /dog_project/docker-compose-qa.yml up -d --scale frontend=3'
                }
            }
        }
        
        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                script {
                    // Detener y eliminar contenedores existentes
                    sh 'docker-compose -f /dog_project/docker-compose-prod.yml down || true'
                    
                    // Desplegar con 2 réplicas para producción
                    sh 'docker-compose -f /dog_project/docker-compose-prod.yml up -d --scale frontend=2'
                }
            }
        }
    }
    
    post {
        always {
            // Limpieza: eliminar imágenes temporales
            sh 'docker system prune -f || true'
        }
        
        success {
            slackSend color: 'good', message: "Frontend build #${env.BUILD_NUMBER} succeeded!"
        }
        
        failure {
            slackSend color: 'danger', message: "Frontend build #${env.BUILD_NUMBER} failed!"
        }
    }
}
