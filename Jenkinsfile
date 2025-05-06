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
                sh 'npm test'
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
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
                sh 'cd /opt/dog_project && docker-compose -f docker-compose-qa.yml up -d --scale frontend=3'
            }
        }
        
        stage('Deploy Prod') {
            when {
                branch 'main'
            }
            steps {
                sh 'cd /opt/dog_project && docker-compose -f docker-compose-prod.yml up -d --scale frontend=2'
            }
        }
    }
}
