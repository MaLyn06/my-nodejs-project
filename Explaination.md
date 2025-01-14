1. Problem to be Solved

    The problem we are addressing is the need to automate the process of scraping content from a webpage and creating a summary of that content. 

    Here's how the system works:

        Content Scraping: The system retrieves text from a given webpage.

        Summary Creation: Once the text is fetched, a concise summary is generated using an AI tool.
        
        Job Management: Each task is tracked, including important details like the URL, task status, the summary, any error messages, and timestamps.

    This system allows users to initiate tasks, monitor their progress, and receive updates on whether the task is complete or failed. This makes it easy to manage and track jobs.

2. Technical Specification

    This system is built using Node.js, and it automates the processes of scraping content from webpages and generating summaries. Here's how the system is structured:
    
    Components:

        Express: A web framework used to build the API that powers the system.

        MongoDB: A database used to store job details such as URLs, status, content, timestamps, etc.

        Puppeteer: A tool that scrapes content from webpages by simulating a browser.

        OpenAI API: This API is used to generate summaries for the scraped content.

        Jest: A testing framework used to ensure the system functions correctly.

        TypeScript: The entire codebase is written in TypeScript, ensuring better type safety, reducing runtime errors, and providing enhanced code readability and maintainability.

    How It Works:

        Create a Job: A user sends a request to start a job with a URL and, optionally, content.

        Scraping: If no content is provided, Puppeteer scrapes the webpage for text. If scraping fails or returns no content, the job is marked as failed.

        Summary Creation: Once the content is available, OpenAI generates a summary.

        Job Updates: The job status is updated based on whether the process is successful or if there’s an error:

            If successful, the job is marked as "completed."
            
            If there’s an error, the job is marked as "failed" and includes an error message.
        
        API Response: After the task is processed, the system returns the job ID, URL, and status.
    
    SAMPLE REQUEST TO POSTMAN

    Request to submit a Job

        curl --location 'http://localhost:3000/jobs' \
        --header 'Content-Type: application/json' \
        --data '{
        "url": "https://example.com"
        }
        '

    Request to Fetch the Job Status 

        curl --location 'http://localhost:3000/jobs/{id}'
    
    Additionally, a folder has been included with diagrams, including a flowchart and sequence diagram, to illustrate the process and how it works.

3. Technical Decisions

    1. MongoDB

        I chose MongoDB because it’s great for handling unstructured data like job statuses, errors, and scraped content. Its flexibility allows easy updates as requirements change, and it scales well with growing data.

    2. Puppeteer for Scraping

        Puppeteer was my tool of choice for scraping because it can emulate a real browser. This is crucial for interacting with modern websites that rely on JavaScript to load dynamic content.

    3. OpenAI for Summarization

        OpenAI’s GPT-4 was used for summarization because it produces accurate and concise summaries from complex content. It’s reliable and saves time compared to building a summarization tool from scratch.

    4. Mongoose for Data Management

        I used Mongoose to create a structured way of managing data in MongoDB. It made tracking job statuses, errors, and scraped content straightforward and consistent.

    5. Error Handling and Status Tracking
    
        Error handling was prioritized to ensure failed jobs are flagged with helpful error messages. This makes troubleshooting easier and keeps the system predictable for admins.

    Additionally I’ve structured the project into models, controllers, routes, and services within the src folder, with each part serving a specific function:

        - Models define the data format (like the Job model for storing job information).

        - Controllers manage the main logic, like creating and updating jobs.

        - Routes manage how users interact with the system, routing requests to the appropriate controller.

        - Services perform key tasks like scraping content and summarizing it.

    This organization helps keep the system clean, easy to maintain, and ready for future scalability.

4. How was the solution achieves the admin’s desired outcome per the user story?

    This system achieves the admin’s desired outcome of automating content scraping and summarization by:

        Efficient Job Handling: The system handles user requests and starts the process of scraping and summarizing content automatically.

        Job Status Tracking: It tracks each job's status, so admins can see if the job is in progress, completed, or failed.

        Providing Feedback: Admins can check each job's status and review any errors through a unique job ID.

        Scalability: The system can handle multiple jobs at once, though it would need further improvement for very large volumes of tasks.

5. Proof of Concept vs. Production-Ready

    Proof of Concept (PoC)

        TThis is a proof of concept, designed to show basic functionality. It works well for small tasks but isn’t optimized for large-scale operations.

To Make This Production-Ready:

    The system would need the following improvements:

Improve Efficiency:

    Use job queues and parallel processing to handle tasks more quickly and efficiently.

Enhance Security:

    Add input validation and safety measures to protect against malicious attacks.

Better Error Handling:

    Improve error tracking, implement retry logic for temporary failures, and set up system monitoring.

Performance Improvements:

    Address slowdowns caused by tools like Puppeteer and the OpenAI API to ensure faster performance.
