# future-messages

API which allows you to schedule your messages

## Prerequisites

Ensure you have the following installed on your machine:

- Docker
- Docker Compose

## Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/your-project.git
    ```

2. Change into the project directory:

    ```bash
    cd future-messages
    ```


3. Build and start the Docker containers:

    ```bash
    docker-compose up -d
    ```

4. Schedule your message using POST [http://localhost:3000/api/scheduled-messages](App servers are launched at 3000, 3001, 3002 ports)
    
    ```json
    {
      "time":"13:12:21",
      "msg": "Hello,World"
     }

5. Scheduled messages will be displayed within Nest Logs

    ```bash
    LOG [MessagesSchedulerService] Scheduled for: 13:44:00; Msg: Hello,World
    LOG [MessagesSchedulerService] Scheduled for: 13:47:00; Recovered msg: Hello,World
    ```      

## Stopping the Application

To stop the application:

```bash
docker-compose down
