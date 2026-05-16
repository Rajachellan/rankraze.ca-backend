pipeline {
    agent any

    environment {
        DOCKER_IMAGE   = "rankraze-ca-backend"
        CONTAINER_NAME = "rankraze-ca-backend-container"
        APP_PORT       = "6005"

        HOST_UPLOAD_DIR = "/home/rankraze/uploads"
        CONTAINER_UPLOAD_DIR = "/app/uploads"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    credentialsId: 'learnfella-credentials',
                    url: 'https://github.com/Rajachellan/rankraze.ca-backend.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                echo "📦 Installing dependencies..."
                npm install --production
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                echo "🐳 Building Docker image..."
                docker build -t $DOCKER_IMAGE:latest .
                '''
            }
        }

        stage('Stop & Remove Old Container') {
            steps {
                sh '''
                echo "🛑 Stopping old container..."
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run New Container (with Volume + .env)') {
            steps {
                withCredentials([
                    file(credentialsId: 'rankraze-ca-env-backend', variable: 'ENV_FILE')
                ]) {
                    sh '''
                    echo "🚀 Running new container with persistent storage..."

                    docker run -d \
                        --name $CONTAINER_NAME \
                        --restart always \
                        -p $APP_PORT:$APP_PORT \
                        -v $HOST_UPLOAD_DIR:$CONTAINER_UPLOAD_DIR \
                        --env-file $ENV_FILE \
                        $DOCKER_IMAGE:latest
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                echo "🩺 Health checking backend..."
                retries=6

                until curl -f http://localhost:$APP_PORT/health || [ $retries -le 0 ]; do
                    echo "Waiting for backend..."
                    sleep 5
                    retries=$((retries-1))
                done

                if [ $retries -le 0 ]; then
                    echo "❌ Backend failed"
                    docker logs $CONTAINER_NAME
                    exit 1
                fi

                echo "✅ Backend is healthy"
                '''
            }
        }

        stage('Verify Container') {
            steps {
                sh '''
                echo "🔍 Verifying container status..."
                if [ "$(docker inspect -f '{{.State.Running}}' $CONTAINER_NAME)" != "true" ]; then
                    echo "❌ Container not running"
                    docker logs $CONTAINER_NAME
                    exit 1
                fi
                echo "✅ Container is running"
                '''
            }
        }

        stage('Verify Volume Mount') {
            steps {
                sh '''
                echo "📂 Verifying volume mount..."
                docker exec $CONTAINER_NAME ls -ld $CONTAINER_UPLOAD_DIR/resumes
                '''
            }
        }
    }

    post {
        success {
            echo "🎉 Rankraze backend deployed successfully!"
            echo "API running on port ${APP_PORT}"
            echo "Resumes stored at ${HOST_UPLOAD_DIR}/resumes"
        }
        failure {
            echo "❌ Deployment failed. Check logs above."
        }
    }
}
