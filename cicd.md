# CI/CD Workflow for expressCart

This document provides a detailed explanation of the CI/CD (Continuous Integration/Continuous Deployment) workflow for the expressCart application, as defined in the `.github/workflows/tests.yaml` file.

## Workflow Overview

The workflow is named `expressCart CI + ECR Push + ECS Deploy` and is designed to automate the testing, building, and deployment of the application. It is triggered on every `push` and `pull_request` to the `master` branch.

The workflow consists of three sequential jobs:

1.  **`test`**: Runs unit tests against the application.
2.  **`build_and_push`**: Builds a Docker image and pushes it to Amazon ECR (Elastic Container Registry).
3.  **`deploy`**: Deploys the new Docker image to Amazon ECS (Elastic Container Service).

---

## Job 1: `test`

This job is responsible for running the application's unit tests to ensure code quality and correctness.

-   **Trigger**: Runs on every `push` and `pull_request` to the `master` branch.
-   **Environment**: It runs on an `ubuntu-latest` runner and tests against a matrix of Node.js versions (`18.x`, `20.x`) and MongoDB version `4.4`.

### Steps:

1.  **Checkout Code**: Checks out the repository's source code.
2.  **Setup Node**: Sets up the specified version of Node.js and caches the `npm` dependencies for faster builds.
3.  **Start MongoDB**: Starts a MongoDB instance using a dedicated GitHub Action, which is required for the tests to run.
4.  **Install Dependencies**: Installs the application's dependencies using `npm ci`, which ensures a clean and reproducible build.
5.  **Run Tests**: Executes the unit tests using the `npm test` command.

---

## Job 2: `build_and_push`

This job builds the application's Docker image and pushes it to Amazon ECR. It only runs if the `test` job completes successfully and the trigger is a `push` to the `master` branch.

-   **Trigger**: Runs only on a `push` to the `master` branch.
-   **Dependencies**: Depends on the successful completion of the `test` job.

### Steps:

1.  **Checkout Code**: Checks out the repository's source code.
2.  **Configure AWS Credentials**: Configures the necessary AWS credentials to interact with AWS services.
3.  **Ensure ECR Repository Exists**: Checks if the target ECR repository exists and creates it if it doesn't.
4.  **Log in to Amazon ECR**: Authenticates with Amazon ECR to allow for pushing the Docker image.
5.  **Extract Docker Metadata**: Generates tags and labels for the Docker image based on the Git commit SHA and branch.
6.  **Build & Push**: Builds the Docker image using the `Dockerfile` and pushes it to the ECR repository with the generated tags.
7.  **Export IMAGE_URI**: Exports the full URI of the newly pushed Docker image as an output, which is used by the `deploy` job.

---

## Job 3: `deploy`

This job deploys the newly built Docker image to the Amazon ECS service. It runs only after the `build_and_push` job has completed successfully.

-   **Trigger**: Runs only after the `build_and_push` job is complete.
-   **Dependencies**: Depends on the successful completion of the `build_and_push` job.

### Steps:

1.  **Checkout Code**: Checks out the repository's source code.
2.  **Configure AWS Credentials**: Configures the necessary AWS credentials.
3.  **Resolve Current Task Definition ARN**: Retrieves the Amazon Resource Name (ARN) of the currently running ECS task definition.
4.  **Download Current Task Definition**: Downloads the JSON file of the current task definition.
5.  **Prepare New Task Definition**: Creates a new task definition file by updating the downloaded file with the new Docker image URI from the `build_and_push` job.
6.  **Register New Task Definition**: Registers the new task definition with ECS and outputs its ARN.
7.  **Update ECS Service**: Updates the ECS service to use the new task definition, which triggers a new deployment with the updated Docker image.
