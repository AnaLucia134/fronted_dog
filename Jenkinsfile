pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = "192.241.148.118:5000"
        IMAGE_NAME = "frontend-dog"
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'develop', url: 'https://github.com/AnaLucia134/fronted_dog.git'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm install'
                sh 'CI=true npm test -- --watchAll=false --passWithNoTests'
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    # Solución temporal para permitir warnings durante el build
                    export CI=false
                    npm run build
                '''
                sh 'docker build -t ${IMAGE_NAME} .'
                sh 'docker tag ${IMAGE_NAME} ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest'
            }
        }
        
        stage('Push') {
            steps {
                sh 'docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:latest'
            }
        }
        
        stage('Deploy QA') {
            steps {
                sh '''
                    cd /opt/dog_project
                    docker-compose -f docker-compose-qa.yml pull frontend
                    docker-compose -f docker-compose-qa.yml up -d --scale frontend=3
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Limpiando...'
            sh 'docker system prune -f'
        }
        success {
            echo 'Pipeline ejecutado con éxito!'
        }
        failure {
            echo 'Pipeline falló. Revisar logs.'
        }
    }
}
